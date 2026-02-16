"use client";

// import Navbar from "@/app/components/Navbar";
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
import { useContext, useRef, useState } from "react";
import { useTranslation } from "@/lib/useTranslation";

// hCaptcha
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { CookiesContext } from "@/components/cookies/cookiesContextProvider";

const formSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(255),
  email: z.string().email(),
  businessName: z.string().min(2),
  requestType: z.string().min(2),
  message: z.string().min(2),
});

function Contattaci() {
  const { t } = useTranslation();
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

  // hCaptcha
  const recaptchaRef = useRef<HCaptcha>(null)
  const [isVerified, setIsverified] = useState<boolean>(false)
  
  //cookies
  const {cookiesSettings} = useContext(CookiesContext);

  async function handleCaptchaSubmission(token: string) {
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
          title: t("contact_us.success_title"),
          description: t("contact_us.success_message"),
        });
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      {/* <Navbar shouldChangeColor={false} /> */}
      {/* <main className="max-w-7xl mx-auto px-4 py-32"> */}
        {/* {cookieConsentAll  */}
        {cookiesSettings && cookiesSettings.all 
          ? <Card>
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
                          <FormLabel>{t("contact_us.name_label")}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t("contact_us.name_placeholder")} 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {t("contact_us.name_description")}
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
                            <Input 
                              placeholder={t("contact_us.email_placeholder")} 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {t("contact_us.email_description")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("contact_us.business_name_label")}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t("contact_us.business_name_placeholder")} 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {t("contact_us.business_name_description")}
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
                          <FormLabel>
                            {t("contact_us.request_type_label")}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t("contact_us.request_type_placeholder")} 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {t("contact_us.request_type_description")}
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
                          <FormLabel>
                            {t("contact_us.message_label")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("contact_us.message_placeholder")} 
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t("contact_us.message_description")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <HCaptcha
                      sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                      ref={recaptchaRef}
                      onVerify={handleCaptchaSubmission}
                    />
                    <Button type="submit" 
                      disabled={!isVerified}
                      className="bg-primary hover:bg-neutral-700 disabled:bg-neutral-400 py-4 px-16 text-secondary-foreground rounded font-bold text-lg"
                    >
                      {t("contact_us.submit_button")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          : <Card>
              <CardContent className="p-4 lg:p-16 lg:py-4">
                <p className="mb-4">
                  {t("contact_us.no_consent_paragraph1").replace("{{email}}", "commerciale@integys.com")}
                  <br />
                </p>
                <p>
                  {t("contact_us.no_consent_paragraph2")}<br />
                  {t("contact_us.no_consent_paragraph3").replace("{{preferences}}", t("contact_us.no_consent_preferences_text"))}
                </p>
              </CardContent>
            </Card>
        }
      {/* </main> */}
    </>
  );
}
export default Contattaci;
