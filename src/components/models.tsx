
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MODELS_DATA } from "@/lib/models-data";

export function Models() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">Our Models</h1>
        <p className="mt-4 text-xl text-muted-foreground">Engineered for emotion. Choose your expression of performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
        {MODELS_DATA.map((model) => (
          <Card key={model.id} className="overflow-hidden flex flex-col group">
            <CardHeader className="p-0">
              <div className="overflow-hidden h-64">
                <Image
                  src={model.images[0].src}
                  alt={model.images[0].alt}
                  width={800}
                  height={600}
                  className={`w-full h-full object-cover ${model.imageObjectClass || 'object-top'} transition-transform duration-500 group-hover:scale-105`}
                  data-ai-hint={model.images[0].hint}
                />
              </div>
            </CardHeader>
            <CardContent className="p-6 flex flex-col flex-grow">
              <CardTitle className="font-headline text-2xl mb-2">{model.name}</CardTitle>
              <CardDescription className="flex-grow text-muted-foreground mb-4">{model.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between items-center">
               <p className="text-lg font-semibold text-foreground">
                  From {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(model.basePrice)}
                </p>
              <Button asChild>
                <Link href={`/configurator?model=${model.id}`}>
                  Configure <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
