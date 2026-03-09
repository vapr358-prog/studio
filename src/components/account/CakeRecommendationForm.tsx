"use client";

import { useState, useTransition } from "react";
import { cakes } from "@/lib/data";
import { CakeCard } from "@/components/CakeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sparkles, Cookie, Loader2, Quote } from "lucide-react";
import type { Cake } from "@/lib/types";
import { getCakeRecommendations } from "@/lib/actions";

interface CakeRecommendationFormProps {
  flavors: string[];
}

export default function CakeRecommendationForm({ flavors }: CakeRecommendationFormProps) {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Cake[]>([]);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFlavorChange = (flavor: string, checked: boolean) => {
    setSelectedFlavors(prev => 
      checked ? [...prev, flavor] : prev.filter(f => f !== flavor)
    );
  };

  const handleGetRecommendations = async () => {
    const formData = new FormData();
    selectedFlavors.forEach(f => formData.append("flavors", f));

    startTransition(async () => {
      const result = await getCakeRecommendations({}, formData);
      if (result.recommendations) {
        const recommendedCakes = cakes.filter(c => result.recommendations?.includes(c.id));
        setRecommendations(recommendedCakes);
        setExplanation(result.explanation || null);
      }
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="rounded-[2rem] border-none shadow-xl bg-white/90">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">Para Ti</CardTitle>
          <CardDescription>Selecciona tus sabores y encuentra tu tarta ideal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {flavors.map((flavor) => (
              <div key={flavor} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                <Checkbox 
                  id={`flavor-${flavor}`} 
                  checked={selectedFlavors.includes(flavor)}
                  onCheckedChange={(checked) => handleFlavorChange(flavor, checked as boolean)}
                />
                <Label htmlFor={`flavor-${flavor}`} className="cursor-pointer font-medium">{flavor}</Label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGetRecommendations}
            className="w-full py-6 rounded-full bg-pink-500 hover:bg-pink-600 font-bold"
            disabled={isPending || selectedFlavors.length === 0}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consultando al Sumiller...
              </>
            ) : "Ver Recomendaciones"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="rounded-[2rem] border-none shadow-xl bg-pink-50/30 min-h-[400px]">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2 text-primary">
            <Sparkles className="text-yellow-500" />
            Sugerencias del Sumiller
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {explanation && (
            <div className="bg-white/60 p-4 rounded-2xl border border-pink-100 italic text-primary/80 flex gap-3">
              <Quote className="h-5 w-5 shrink-0 opacity-20" />
              <p className="text-sm leading-relaxed">{explanation}</p>
            </div>
          )}
          
          {recommendations.length > 0 ? (
            <div className="grid gap-6">
              {recommendations.map((cake) => (
                <CakeCard key={cake.id} cake={cake} />
              ))}
            </div>
          ) : !isPending && (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
              <Cookie className="h-16 w-16 mb-2" />
              <p className="italic">Elige sabores para ver qué tenemos para ti</p>
            </div>
          )}

          {isPending && (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
              <Loader2 className="h-16 w-16 mb-2 animate-spin" />
              <p className="italic">Buscando el maridaje perfecto...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
