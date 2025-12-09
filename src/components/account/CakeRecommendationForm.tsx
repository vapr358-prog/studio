"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState, useRef } from "react";
import { getCakeRecommendations } from "@/lib/actions";
import type { RecommendationState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThumbsUp, PartyPopper } from "lucide-react";

interface CakeRecommendationFormProps {
  flavors: string[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Buscando recomendaciones..." : "Obtener Recomendaciones"}
    </Button>
  );
}

export default function CakeRecommendationForm({ flavors }: CakeRecommendationFormProps) {
  const initialState: RecommendationState = {};
  const [state, dispatch] = useFormState(getCakeRecommendations, initialState);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.recommendations) {
      setRecommendations(state.recommendations);
      formRef.current?.reset();
    }
  }, [state.timestamp]); // Use timestamp to detect new state

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <form action={dispatch} ref={formRef}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Descubre tu Próximo Pastel Favorito</CardTitle>
            <CardDescription>
              Selecciona tus sabores preferidos y nuestra IA te recomendará algo especial solo para ti.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Tus sabores favoritos:</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {flavors.map((flavor) => (
                  <div key={flavor} className="flex items-center space-x-2">
                    <Checkbox id={`flavor-${flavor}`} name="flavors" value={flavor} />
                    <Label htmlFor={`flavor-${flavor}`} className="font-normal cursor-pointer">
                      {flavor}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <Card className="bg-muted/50 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ThumbsUp className="text-primary" />
            Nuestras Sugerencias
          </CardTitle>
          <CardDescription>Basado en tus gustos, creemos que te encantarán estos:</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {recommendations.length > 0 ? (
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg shadow-sm">
                  <PartyPopper className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <p>Tus recomendaciones aparecerán aquí.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
