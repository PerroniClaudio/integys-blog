"use client";

import { useState } from "react";
import { Button } from "./button";
import NewsletterDialog from "./newsletter-dialog";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
};

function NewsletterButton({className}: Props) {

  const[isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        variant={"secondary"}
        className={twMerge("text-secondary-foreground text-lg py-4 px-4 min-w-fit text-center bg-primary w-fit", className || "")}
        onClick={() => setIsOpen(true)}
      >
        Iscriviti alla newsletter
      </Button>
      <NewsletterDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default NewsletterButton;