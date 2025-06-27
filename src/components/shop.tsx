"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const SHOP_PRODUCTS: {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  hint: string;
}[] = [
  {
    id: 'carbon-spoiler',
    name: 'RAWRK Carbon Fiber Spoiler',
    description: 'Lightweight, high-performance carbon fiber spoiler for improved aerodynamics and aggressive styling.',
    price: 255000,
    image: "/images/RAWRK-Alpha-Strÿk-Edition.png",
    hint: 'car spoiler'
  },
  {
    id: 'starlight-headliner',
    name: 'RAWRK StarLight Headliner',
    description: 'Transform your cabin with a custom fiber-optic star-filled sky.',
    price: 135000,
    image: "/images/RAWRK-Royal-Shadow-Edition.png",
    hint: 'car interior'
  },
  {
    id: 'sound-system',
    name: 'Burmester Surround Sound',
    description: 'Immersive, high-fidelity audio experience from one of the best in the business.',
    price: 145000,
    image: "/images/RAWRK-White-Silenzia-Édition.png",
    hint: 'car audio'
  }
];

export function Shop() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">RAWRK Performance Shop</h1>
        <p className="mt-4 text-xl text-muted-foreground">Upgrade your ride with our hand-picked selection of premium parts.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SHOP_PRODUCTS.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint={product.hint}
              />
            </CardHeader>
            <CardContent className="p-6 flex flex-col flex-grow">
              <CardTitle className="font-headline text-xl mb-2">{product.name}</CardTitle>
              <CardDescription className="flex-grow text-muted-foreground mb-4">{product.description}</CardDescription>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold font-headline text-accent">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(product.price)}
                </p>
                <Button>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
