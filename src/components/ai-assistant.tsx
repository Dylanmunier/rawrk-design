"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, AlertTriangle, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getAISuggestions } from "@/app/actions";
import type { SuggestProjectImprovementsOutput } from "@/ai/flows/suggest-project-improvements";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function AiAssistant({ project }: { project: Project }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestProjectImprovementsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await getAISuggestions(project);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Button onClick={handleGetSuggestions} disabled={loading} variant="default" className="bg-accent hover:bg-accent/90">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        AI Assistant
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Lightbulb className="text-accent" /> AI-Powered Suggestions
            </DialogTitle>
            <DialogDescription>
              Here are some suggestions to improve '{project.title}' based on similar successful projects.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && (
              <div className="space-y-6">
                <div>
                    <h3 className="font-semibold font-headline mb-2">Suggestions</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {result.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold font-headline mb-2">Rationale</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.rationale}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
