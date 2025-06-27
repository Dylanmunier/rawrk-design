"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Wand2, Sparkles, Palette, Sofa } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getAiSuggestions } from "@/app/actions";
import type { SuggestCustomizationsOutput } from "@/ai/flows/suggest-customizations";

const formSchema = z.object({
  preferences: z.string().min(15, "Please describe your style in a bit more detail to get better suggestions.").max(500),
});

interface AiSuggesterProps {
  vehicleModel: string;
  onApplySuggestions: (suggestions: SuggestCustomizationsOutput) => void;
}

export function AiSuggester({ vehicleModel, onApplySuggestions }: AiSuggesterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestCustomizationsOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { preferences: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await getAiSuggestions(vehicleModel, values.preferences);
      setSuggestions(result);
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestions) {
      onApplySuggestions(suggestions);
      setIsDialogOpen(false);
      toast({
        title: "Suggestions Applied!",
        description: "Your vehicle has been updated with the AI's recommendations.",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI Customization Assistant</CardTitle>
          <CardDescription>
            Tell us about your personality and style, and our AI will suggest the perfect customizations for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your style</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I love a minimalist, modern look with a touch of sportiness. I prefer dark, subtle colors and high-tech gadgets.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Get Suggestions
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-accent" />
              AI Suggestions for You
            </AlertDialogTitle>
            <AlertDialogDescription>
              Based on your style, here's what we think you'll love. You can apply these suggestions directly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {suggestions && (
            <div className="space-y-4 py-4 text-sm">
              <p className="italic text-muted-foreground">{`"${suggestions.reasoning}"`}</p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Sofa className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground"/>
                  <div><strong>Interior:</strong> {suggestions.suggestedInteriorStyle}</div>
                </div>
                 <div className="flex items-start">
                  <Sparkles className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground"/>
                  <div><strong>Options:</strong> {suggestions.suggestedComfortOptions.join(", ")}</div>
                </div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApply}>
              Apply Suggestions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
