"use client";

import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRef, useState } from "react";

// reCAPTCHA
import ReCAPTCHA from "react-google-recaptcha";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Il nome deve essere lungo almeno 2 caratteri",
    })
    .max(255),
  email: z.string().email({
    message: "Inserisci un indirizzo email valido",
  }),
  businessName: z.string().min(2, {
    message: "Il nome dell'azienda è obbligatorio",
  }),
  requestType: z.string().min(2, {
    message: "Il tipo di richiesta è obbligatorio",
  }),
  message: z.string().min(2, {
    message: "Il messaggio è obbligatorio",
  }),
});

function Contattaci() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      businessName: "",
      requestType: "",
      message: "",
    },
  });

  // reCAPTCHA
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [isVerified, setIsverified] = useState<boolean>(false)

  async function handleCaptchaSubmission(token: string | null) {
    // Server function to verify captcha
    const request = fetch("/api/captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token
      }),
    });

    const response = await request;
    if(response.ok) {
      setIsverified(true)
    } else {
      setIsverified(false)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        toast({
          title: "Richiesta di contatto registrata con successo",
          description: "A breve verrà contattato da uno dei nostri operatori",
        });
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Navbar shouldChangeColor={false} />
      <main className="max-w-7xl mx-auto px-4 py-32">
        <Card>
          <CardContent className="p-4 lg:p-16">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome e Cognome</FormLabel>
                      <FormControl>
                        <Input placeholder="Mario Rossi" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome e cognome del referente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@esempio.com" {...field} />
                      </FormControl>
                      <FormDescription>Email del referente</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ragione Sociale</FormLabel>
                      <FormControl>
                        <Input placeholder="Azienda SRL" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ragione Sociale del referente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requestType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo di richiesta</FormLabel>
                      <FormControl>
                        <Input placeholder="Richiesta di contatto" {...field} />
                      </FormControl>
                      <FormDescription>
                        Tipo di richiesta, es. &quot;Richiesta di contatto&quot;
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Messaggio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Scrivi un messaggio..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Messaggio da inviare</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  ref={recaptchaRef}
                  onChange={handleCaptchaSubmission}
                />
                <Button type="submit" 
                  disabled={!isVerified}
                  className="bg-primary hover:bg-neutral-700 disabled:bg-neutral-400 py-4 px-16 text-secondary-foreground rounded font-bold text-lg"
                >
                  Invia
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
export default Contattaci;
