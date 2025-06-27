"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MODELS_DATA } from "@/lib/models-data";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.14))]">
      <main className="flex-1">
        <section className="relative w-full h-full min-h-[calc(100vh-theme(spacing.14))] flex items-center justify-center text-white overflow-hidden">
           <video
            src="/images/rawrk_luxury_custom.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover brightness-50"
          >
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="container relative px-4 md:px-6">
            <div className="max-w-3xl text-center mx-auto space-y-6">
              <div
                className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000"
              >
                <div className="inline-block rounded-lg bg-black/40 px-3 py-1 text-sm font-semibold text-accent font-headline">
                  RAWRK
                </div>
                <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-7xl">
                  L'Art de la Transformation
                </h1>
                <p className="max-w-[600px] text-neutral-200 md:text-xl mx-auto">
                  Découvrez notre savoir-faire unique où chaque véhicule devient une œuvre d'art. Le luxe et la performance, redéfinis.
                </p>
              </div>
              <div
                className="flex flex-col gap-2 min-[400px]:flex-row pt-4 justify-center animate-in fade-in-0 slide-in-from-bottom-10 duration-1000 animate-delay-200"
              >
                <Button asChild size="lg" className="font-bold">
                  <Link href="/models">
                    Nos Modèles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="font-bold border-neutral-400 bg-transparent hover:bg-white/90 hover:text-black"
                >
                  <Link href="/configurator">Configurer</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-semibold text-accent font-headline">
                Nos Éditions
              </div>
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                Découvrez Nos Créations Uniques
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Chaque modèle RAWRK est une pièce d'exception, méticuleusement conçue pour offrir une expérience de conduite et un style inégalés.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-20">
              {MODELS_DATA.map((model, index) => {
                const features = Object.entries(model.features).filter(
                  ([, value]) => !!value
                );
                return (
                  <article
                    key={model.id}
                    className="grid gap-8 md:grid-cols-2 md:gap-12 items-center"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <div
                          className={cn(
                            "rounded-lg overflow-hidden shadow-2xl group cursor-pointer",
                            index % 2 !== 0 && "md:order-last"
                          )}
                        >
                          <Image
                            src={model.images[0].src}
                            alt={model.images[0].alt}
                            width={800}
                            height={600}
                            className={cn(
                              "aspect-[4/3] object-cover transition-transform group-hover:scale-105 duration-500",
                              model.imageObjectClass
                            )}
                            data-ai-hint={model.images[0].hint}
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="font-headline text-2xl">
                            {model.name}
                          </DialogTitle>
                          <DialogDescription>
                            {model.baseVehicle}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="rounded-lg overflow-hidden border">
                             <Image
                                src={model.images[0].src}
                                alt={model.images[0].alt}
                                width={1200}
                                height={800}
                                className={cn("w-full h-auto object-cover", model.imageObjectClass)}
                                data-ai-hint={model.images[0].hint}
                              />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg font-headline mb-4">
                              Caractéristiques RAWRK
                            </h4>
                            <div className="space-y-2 text-sm">
                              {features.map(([key, value], featureIndex) => (
                                <React.Fragment key={key}>
                                  <div className="flex justify-between items-start gap-4">
                                    <span className="capitalize text-muted-foreground">
                                      {key.replace(/_/g, " ")}
                                    </span>
                                    <strong className="text-right text-foreground">
                                      {value}
                                    </strong>
                                  </div>
                                  {featureIndex < features.length - 1 && (
                                    <Separator className="my-3" />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold font-headline">
                        {model.name}
                      </h3>
                      <p className="text-muted-foreground">{model.description}</p>
                      <Button asChild>
                        <Link href={`/configurator?model=${model.id}`}>
                          Configurer ce modèle{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
