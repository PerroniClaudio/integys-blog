"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView, trackButtonClick } from "@/lib/tracking-service";

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Usa un ref per tenere traccia dell'ultimo URL tracciato
  const lastTrackedUrlRef = useRef<string>("");
  const [fullUrlString, setFullUrlString] = useState<string>("");

  useEffect(() => {
    // Ricostruisci l'URL completo con i parametri di query
    const fullUrl = `${window.location.origin}${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    setFullUrlString(fullUrl);

    // Verifica se questo URL è già stato tracciato recentemente
    if (fullUrl === lastTrackedUrlRef.current) {
      return;
    }

    // Aggiorna l'URL tracciato
    lastTrackedUrlRef.current = fullUrl;

    // Traccia la visualizzazione della pagina
    trackPageView(fullUrl);
  }, [pathname, searchParams]);

  // Effetto per il tracciamento dei click sui bottoni
  useEffect(() => {
    // Funzione per gestire i click
    const handleClick = (event: MouseEvent) => {
      // Verifica che l'elemento cliccato o uno dei suoi genitori sia un bottone
      const findButton = (
        element: Element | null
      ): HTMLButtonElement | null => {
        if (!element) return null;
        if (element.tagName === "BUTTON") return element as HTMLButtonElement;
        return findButton(element.parentElement);
      };

      const buttonElement = findButton(event.target as Element);

      if (buttonElement) {
        // Verifica se il bottone ha l'attributo data-track-no-track
        if (buttonElement.hasAttribute("data-track-no-track")) {
          return; // Non tracciare questo bottone
        }

        // Estrai attributi data-track-* personalizzati
        const trackAttributes: Record<string, string> = {};
        for (const attr of Array.from(buttonElement.attributes)) {
          if (
            attr.name.startsWith("data-track-") &&
            attr.name !== "data-track-no-track"
          ) {
            // Converti data-track-category in category
            const key = attr.name.replace("data-track-", "");
            trackAttributes[key] = attr.value;
          }
        }

        // Attributo data-track-id per tracciamento personalizzato
        const trackId = buttonElement.getAttribute("data-track-id");

        // Traccia il click sul bottone con gli attributi personalizzati
        trackButtonClick({
          id: buttonElement.id || undefined,
          text: buttonElement.innerText || "No text",
          trackId: trackId,
          className: buttonElement.className || undefined,
          path: fullUrlString,
          timestamp: new Date().toISOString(),
          ...trackAttributes, // Includi attributi personalizzati
        });
      }
    };

    // Aggiungi l'event listener a tutto il documento
    document.addEventListener("click", handleClick);

    // Cleanup quando il componente viene smontato
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname]); // Dipendenza pathname per avere sempre il path corrente

  // Questo componente non renderizza nulla, agisce solo come tracker
  return null;
}
