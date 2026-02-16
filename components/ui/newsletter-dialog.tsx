"use client";

import { useState, useRef } from "react";
import Dialog from "./dialog";
import { toast } from "react-toastify";
import { Button } from "./button";
import { useTranslation } from "@/lib/useTranslation";
// import { useToast } from "./use-toast";

// hCaptcha
import HCaptcha from "@hcaptcha/react-hcaptcha";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

interface FormData {
  name: string;
  last_name: string;
  email: string;
}

function NewsletterDialog({isOpen, setIsOpen}: Props) {

  const { t } = useTranslation();
  // const {toast} = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    last_name: "",
    email: "",
  });

  // hCaptcha
  const recaptchaRef = useRef<HCaptcha>(null)
  const [isVerified, setIsverified] = useState<boolean>(false)

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try{
      const isValidEmail = (email: string): boolean => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
      };
  
      if (!isValidEmail(formData.email)) {
          toast.error(t("newsletter.emailValidation"))
          return;
      }
  
      const request = fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const response = await request;
      const data = await response.json();
  
      setIsOpen(false);
      toast.success(t("newsletter.successMessage"));
      
    }catch(err){
      console.error(err);
      toast.error(t("newsletter.errorMessage")) 
    }
  };

  return (
    <section className="">
      <Dialog
        title={t("newsletter.title")}
        isOpen={isOpen}
        onClose={() => {setIsOpen(false); setIsverified(false)}}>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold text-primary">{t("newsletter.firstName")}</label>
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              value={formData.name}
              onChange={(e) => handleChange(e)}
              placeholder={t("newsletter.firstNamePlaceholder")}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="last_name" className="font-semibold text-primary">{t("newsletter.lastName")}</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              value={formData.last_name}
              onChange={(e) => handleChange(e)}
              placeholder={t("newsletter.lastNamePlaceholder")}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="business" className="font-semibold text-primary">{t("newsletter.email")}</label>
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              value={formData.email}
              onChange={(e) => handleChange(e)}
              placeholder={t("newsletter.emailPlaceholder")}
              required
            />
          </div>

          <HCaptcha
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            ref={recaptchaRef}
            onVerify={handleCaptchaSubmission}
          />
 
          <button
            type="submit"
            // className="bg-neutral-900 hover:bg-neutral-700 w-full p-4 text-primary-400 rounded font-bold">
            className="bg-primary hover:bg-neutral-700 disabled:bg-neutral-400 w-full p-4 text-secondary-foreground rounded font-bold text-lg"
            disabled={!isVerified}    
          >
            {t("newsletter.subscribe")}
          </button>

          <p className="italic text-sm">
            {t("newsletter.privacyNotice")}
          </p>
 
        </form>
      </Dialog>
    </section>
  );
}

export default NewsletterDialog;
