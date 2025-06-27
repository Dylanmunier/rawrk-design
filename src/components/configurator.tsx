
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Car, Palette, Sofa, Sparkles, Wand2, ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AiSuggester } from "@/components/ai-suggester";
import type { CustomizationOption, Selections } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { SuggestCustomizationsOutput } from "@/ai/flows/suggest-customizations";
import { MODELS_DATA, DEFAULT_MODEL } from "@/lib/models-data";
import type { ModelData } from "@/lib/models-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


const DELIVERY_COST = 1500;

const INTERIOR_OPTIONS: CustomizationOption[] = [
  { value: 'nappa-black', label: 'Nappa Leather Black', price: 0, icon: Sofa },
  { value: 'nappa-red', label: 'Nappa Leather Red', price: 1200, icon: Sofa },
  { value: 'cuir-alcantara', label: 'RAWRK Cuir-Alcantara', price: 2800, icon: Sofa, aliases: ['DINAMICA Microfiber'] },
];

const COMFORT_OPTIONS: CustomizationOption[] = [
  { value: 'heated-seats', label: 'Heated & Ventilated Seats', price: 1800 },
  { value: 'sound-system', label: 'Burmester Surround Sound', price: 4500 },
  { value: 'starlight-headliner', label: 'RAWRK StarLight Headliner', price: 3500, aliases: ['Ambient Lighting'] },
  { value: 'carbon-spoiler', label: 'RAWRK Carbon Fiber Spoiler', price: 2500, aliases: ['Panoramic Sunroof'] },
  { value: 'privacy-glass', label: 'Privacy Glass', price: 700 },
  { value: 'soundproofing', label: 'Cabin Soundproofing', price: 1500 },
];

export function Configurator({ selectedModelId: initialModelId }: { selectedModelId?: string }) {
  const initialModel = useMemo(() => {
    return MODELS_DATA.find(m => m.id === initialModelId) || DEFAULT_MODEL;
  }, [initialModelId]);
  
  const [currentModel, setCurrentModel] = useState<ModelData>(initialModel);

  const [selections, setSelections] = useState<Selections>({
    interior: INTERIOR_OPTIONS[0],
    comfort: [],
  });

  const optionsPrice = useMemo(() => {
    const interiorPrice = selections.interior.price;
    const comfortPrice = selections.comfort.reduce((sum, option) => sum + option.price, 0);
    return interiorPrice + comfortPrice;
  }, [selections]);

  const totalPrice = useMemo(() => {
    return currentModel.basePrice + optionsPrice + DELIVERY_COST;
  }, [optionsPrice, currentModel.basePrice]);

  useEffect(() => {
    setCurrentModel(initialModel);
  }, [initialModel]);
  
  const handleModelChange = (modelId: string) => {
    const newModel = MODELS_DATA.find(m => m.id === modelId);
    if (newModel) {
      setCurrentModel(newModel);
      // Reset selections when model changes for a fresh start
      setSelections({
        interior: INTERIOR_OPTIONS[0],
        comfort: [],
      });
    }
  };

  const handleComfortChange = (option: CustomizationOption) => {
    setSelections(prev => {
      const newComfort = prev.comfort.some(c => c.value === option.value)
        ? prev.comfort.filter(c => c.value !== option.value)
        : [...prev.comfort, option];
      return { ...prev, comfort: newComfort };
    });
  };

  const handleApplySuggestions = (suggestions: SuggestCustomizationsOutput) => {
    const newInterior = INTERIOR_OPTIONS.find(i => 
      i.label.toLowerCase() === suggestions.suggestedInteriorStyle.toLowerCase() ||
      i.aliases?.some(alias => alias.toLowerCase() === suggestions.suggestedInteriorStyle.toLowerCase())
    ) || selections.interior;

    const newComfort = suggestions.suggestedComfortOptions
      .map(suggestion => COMFORT_OPTIONS.find(opt => 
          opt.label.toLowerCase() === suggestion.toLowerCase() ||
          opt.aliases?.some(alias => alias.toLowerCase() === suggestion.toLowerCase())
      ))
      .filter((opt): opt is CustomizationOption => !!opt);

    setSelections({
      interior: newInterior,
      comfort: newComfort,
    });
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold tracking-tight">{currentModel.name}</h1>
        <p className="text-muted-foreground mt-2 text-lg">Personalize your ride, based on the {currentModel.baseVehicle}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 w-full max-w-7xl">
        <div className="lg:col-span-3 relative">
           <Carousel className="w-full">
            <CarouselContent>
              {currentModel.images.map((img, index) => (
                <CarouselItem key={index}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="overflow-hidden shadow-2xl cursor-pointer">
                        <CardContent className="p-0 relative">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={1200}
                            height={800}
                            className="w-full h-auto object-cover"
                            data-ai-hint={img.hint}
                            priority={index === 0}
                          />
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm">
                            {img.viewName}
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={1600}
                        height={1200}
                        className="w-full h-auto object-cover rounded-lg"
                        data-ai-hint={img.hint}
                      />
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div>
              <Label htmlFor="model-select" className="font-headline text-lg">Select Model</Label>
              <Select onValueChange={handleModelChange} value={currentModel.id}>
                <SelectTrigger id="model-select" className="mt-2">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {MODELS_DATA.map(model => (
                    <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          <Tabs defaultValue="customize" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="customize"><Palette className="w-4 h-4 mr-2"/>Customize</TabsTrigger>
              <TabsTrigger value="ai-suggester"><Wand2 className="w-4 h-4 mr-2"/>AI Assist</TabsTrigger>
              <TabsTrigger value="specs"><ClipboardList className="w-4 h-4 mr-2"/>Specs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customize" className="mt-6">
              <div className="space-y-8">
                <section>
                    <h3 className="text-lg font-semibold mb-2 font-headline flex items-center"><Palette className="mr-2 h-5 w-5 text-accent" />Couleur Exclusive</h3>
                    <div className="p-4 rounded-lg border bg-card">
                        <p className="font-semibold">{currentModel.features.peinture}</p>
                        <p className="text-sm text-muted-foreground">Cette couleur est unique à l'édition {currentModel.name} et ne peut être modifiée.</p>
                    </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4 font-headline flex items-center"><Sofa className="mr-2 h-5 w-5 text-accent"/>Interior Style</h3>
                  <RadioGroup
                    value={selections.interior.value}
                    onValueChange={(value) => {
                      const selected = INTERIOR_OPTIONS.find(o => o.value === value) || INTERIOR_OPTIONS[0];
                      setSelections(prev => ({ ...prev, interior: selected }));
                    }}
                    className="space-y-2"
                  >
                    {INTERIOR_OPTIONS.map(option => (
                      <Label key={option.value} className="flex items-center gap-4 p-4 rounded-lg border bg-card has-[input:checked]:bg-accent/10 has-[input:checked]:border-accent cursor-pointer transition-colors">
                        <RadioGroupItem value={option.value} id={option.value} />
                        {option.icon && <option.icon className="w-6 h-6" />}
                        <span className="flex-grow">{option.label}</span>
                        <span className="text-muted-foreground text-sm">+{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(option.price)}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-4 font-headline flex items-center"><Sparkles className="mr-2 h-5 w-5 text-accent"/>Comfort & Tech</h3>
                  <div className="space-y-4">
                    {COMFORT_OPTIONS.map(option => (
                      <div key={option.value} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                        <Label htmlFor={option.value} className="flex-grow cursor-pointer">{option.label}</Label>
                        <span className="text-muted-foreground text-sm mr-4">+{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(option.price)}</span>
                        <Checkbox
                          id={option.value}
                          checked={selections.comfort.some(c => c.value === option.value)}
                          onCheckedChange={() => handleComfortChange(option)}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </TabsContent>

            <TabsContent value="ai-suggester" className="mt-6">
              <AiSuggester vehicleModel={currentModel.name} onApplySuggestions={handleApplySuggestions} />
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Caractéristiques RAWRK</CardTitle>
                        <CardDescription>{currentModel.baseVehicle}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex justify-between items-start gap-4"><span>Peinture:</span> <strong className="text-right">{currentModel.features.peinture}</strong></div>
                        <Separator/>
                        <div className="flex justify-between items-start gap-4"><span>Finition:</span> <strong className="text-right">{currentModel.features.finition}</strong></div>
                        <Separator/>
                         {currentModel.features.bodykit && (
                            <>
                                <div className="flex justify-between items-start gap-4"><span>Bodykit:</span> <strong className="text-right">{currentModel.features.bodykit}</strong></div>
                                <Separator/>
                            </>
                        )}
                        <div className="flex justify-between items-start gap-4"><span>Jantes:</span> <strong className="text-right">{currentModel.features.jantes}</strong></div>
                        <Separator/>
                        <div className="flex justify-between items-start gap-4"><span>Sellerie:</span> <strong className="text-right">{currentModel.features.sellerie}</strong></div>
                        <Separator/>
                         {currentModel.features.echappement && (
                            <>
                                <div className="flex justify-between items-start gap-4"><span>Échappement:</span> <strong className="text-right">{currentModel.features.echappement}</strong></div>
                                <Separator/>
                            </>
                        )}
                        <div className="flex justify-between items-start gap-4"><span>Audio:</span> <strong className="text-right">{currentModel.features.audio}</strong></div>
                        {currentModel.features.edition && (
                            <>
                                <Separator/>
                                <div className="flex justify-between items-start gap-4"><span>Édition:</span> <strong className="text-right">{currentModel.features.edition}</strong></div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-2" />

          <div className="space-y-4">
            <h3 className="font-headline text-2xl font-semibold">Price Summary</h3>
            <div className="flow-root text-muted-foreground">
                <dl className="space-y-2">
                    <div className="flex items-center justify-between"><dt>Base Vehicle</dt><dd className="font-medium text-foreground">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(currentModel.basePrice)}</dd></div>
                    <div className="flex items-center justify-between"><dt>Options Mercedes</dt><dd className="font-medium text-foreground">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(optionsPrice)}</dd></div>
                    <div className="flex items-center justify-between"><dt>Delivery</dt><dd className="font-medium text-foreground">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(DELIVERY_COST)}</dd></div>
                </dl>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-2xl font-bold font-headline">
                <dt>Total</dt>
                <dd className="text-accent">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(totalPrice)}</dd>
            </div>
             <Button size="lg" className="w-full mt-2 font-bold text-lg" asChild>
                <Link href="/shop">
                  <Car className="mr-2 h-5 w-5" />
                  Finalize & Order
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
