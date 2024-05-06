"use client";

import { useContext, useEffect, useState } from "react";
// import { FaCookieBite, FaWindowClose } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Cookie, X } from "lucide-react";
import { CookiesContext } from "../cookies/cookiesContextProvider";

type CookieConsent = {
  all: boolean;
  isChoiceDone: boolean;
  values: {
    necessary: boolean;
    preferences: boolean;
    statistics: boolean;
    marketing: boolean;
  };
};

function CookiesBanner() {
  const router = useRouter();
  
  const {cookiesSettings, setCookies} = useContext(CookiesContext);

  const [isVisible, setIsVisible] = useState(false);

  const [showDetails, setshowDetails] = useState(false);
  const [detailsId, setDetailsId] = useState(1)

  const [values, setValues] = useState({
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false,
  });
  
  useEffect(() => {
    if (cookiesSettings) {
      console.log("Banner: ", {cookiesSettings});
      setValues(cookiesSettings.values);
      setIsVisible(cookiesSettings.isChoiceDone ? false : true);
    } else {
      setIsVisible(true);
    }
  }, [cookiesSettings]);

  useEffect(() => {
    const body = document.querySelector("body");
    if (isVisible) {
      body?.classList.add("overflow-hidden");
    } else {
      body?.classList.remove("overflow-hidden");
    }
  }, [isVisible]);

  const openBanner = () => {
    const localItem = localStorage.getItem("CookieConsent");
    if(localItem){
      const data = JSON.parse(localItem);
      setValues(data.values);
    }
    setIsVisible(true);
  };

  async function handleSubmit(e: React.MouseEvent, choice: string) {
    e.preventDefault();
    // Qui si setta il cookie per le preferenze dell'utente. dato che non si può controllare il comportamento di YouTube, se non vengono accettati tutti, i video embedded dovranno essere disabilitati in ogni caso
    setCookies({
        all:
          choice === "all"
            ? true
            : choice === "none"
            ? false
            : Object.values(values).every((value) => value === true)
            ? true
            : false,
        isChoiceDone: true,
        values:
          choice === "all"
            ? {
                necessary: true,
                preferences: true,
                statistics: true,
                marketing: true,
              }
            : choice === "none"
            ? {
                necessary: true,
                preferences: false,
                statistics: false,
                marketing: false,
              }
            : values,
      }
      // )
    );
    setIsVisible(false);
    // window.location.reload();
    // router.refresh()
  }

  return (
    <div>
      <button
        className="bg-primary text-white px-1 rounded-md shadow-lg"
        onClick={openBanner}
      >Preferenze cookies</button>

      {/* Banner cookies */}
      <div className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-30 z-50 ${!isVisible && "hidden"}`}>
      </div>
      <div
        id="cookies-popup"
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none bg-background px-1 sm:px-6 
          rounded-md border-[1px] border-foreground outline outline-2 outline-background
          w-fit
          ${!isVisible && "hidden"}
        `}
      >
        <Cookie size={52} strokeWidth={2} absoluteStrokeWidth className='text-foreground absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3/4 sm:-translate-x-1/2 p-1 bg-background rounded-full border-[1px] border-foreground outline outline-4 outline-background' />
        {/* <FaCookieBite className='text-5xl text-primary-500 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-1 bg-white rounded-full border-[1px] border-primary-500 outline outline-4 outline-white' /> */}
        <div className="w-fit sm:max-w-full m-auto flex flex-col justify-center items-center py-3 px-3 gap-8 lg:flex-row max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-1 text-foreground text-xs sm:text-sm">
            <div className={`flex justify-start gap-8 font-semibold ${showDetails && "px-4"} sm:p-0`}>
              INFORMATIVA BREVE COOKIE
              {/* <i className="fas fa-cookie-bite text-3xl text-evolution-800"></i> */}
            </div>
            <p className={`${showDetails && "px-4"} sm:p-0`}>
              Questo sito utilizza cookie tecnici e di profilazione di terze parti, per inviarti messaggi pubblicitari mirati e 
              servizi in linea con le tue preferenze, per personalizzare contenuti ed annunci, per fornire funzionalità dei social 
              media e per analizzare il nostro traffico. Condividiamo inoltre informazioni sul modo in cui utilizza il nostro sito 
              con i nostri partner che si occupano di analisi dei dati web, pubblicità e social media, i quali potrebbero combinarle 
              con altre informazioni che ha fornito loro o che hanno raccolto dal suo utilizzo dei loro servizi. La mera chiusura del 
              banner non comporta l’accettazione dei cookie e atre tecnologie. Vedi la nostra <a href='https://integys.com/cookie-policy/' target="_blank" className='font-semibold text-neutral-600'>Cookie Policy</a>. <br />
              Il consenso può essere espresso cliccando &quot;Accetta tutti&quot; o selezionando le diverse categorie di cookies
            </p>
            <p>
              {/* Questo sito utilizza esclusivamente cookie tecnici.<br/> */}
              Vedi la nostra <a href='https://integys.com/cookie-policy/' target="_blank" className='font-semibold text-neutral-600'>Cookie Policy</a>. <br />
            </p>
            <form
              className={`flex flex-col gap-2 text-xs sm:flex-row sm:gap-4 sm:text-sm sm:p-0 ${showDetails && "px-4"}`}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="necessary"
                  id="necessary"
                  checked={true}
                  readOnly
                />
                <label htmlFor="necessary">Necessari</label>
              </div>
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="preferences"
                  id="preferences"
                  checked={values.preferences}
                  onChange={(e) =>
                    setValues({ ...values, preferences: !values.preferences })
                  }
                />
                <label htmlFor="preferences">Preferenze</label>
              </div>
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="statistics"
                  id="statistics"
                  checked={values.statistics}
                  onChange={(e) =>
                    setValues({ ...values, statistics: !values.statistics })
                  }
                />
                <label htmlFor="statistics">Statistiche</label>
              </div>
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="marketing"
                  id="marketing"
                  checked={values.marketing}
                  onChange={(e) =>
                    setValues({ ...values, marketing: !values.marketing })
                  }
                />
                <label htmlFor="marketing">Marketing</label>
              </div>
              <button 
                className='underline self-start text-sm hidden lg:block'
                onClick={(e)=>{e.preventDefault(); setshowDetails(!showDetails)}}
              >
                Dettagli
              </button>
            </form>
              <button 
                className='underline self-start text-sm lg:hidden'
                onClick={(e)=>{e.preventDefault(); setshowDetails(!showDetails)}}
              >
                Dettagli
              </button>
            <div className={`flex flex-col text-sm ${!showDetails && "hidden"}`}>
              <div className='flex w-fit text-xs text-neutral-600 pr-2 sm:text-sm'>
                <button 
                  className={`font-semibold px-1 rounded-t-md sm:px-4 ${detailsId === 1 ? "bg-foreground text-background" : "bg-transparent text-foreground"}`}
                  onClick={()=>setDetailsId(1)}
                >Necessari</button>
                <button 
                  className={`font-semibold px-1 rounded-t-md sm:px-4 ${detailsId === 2 ? "bg-foreground text-background" : "bg-transparent text-foreground"}`}
                  onClick={()=>setDetailsId(2)}
                >Preferenze</button>
                <button 
                  className={`font-semibold px-1 rounded-t-md sm:px-4 ${detailsId === 3 ? "bg-foreground text-background" : "bg-transparent text-foreground"}`}
                  onClick={()=>setDetailsId(3)}
                >Statistiche</button>
                <button 
                  className={`font-semibold px-1 rounded-t-md sm:px-4 ${detailsId === 4 ? "bg-foreground text-background" : "bg-transparent text-foreground"}`}
                  onClick={()=>setDetailsId(4)}
                >Marketing</button>
              </div>
              <div 
                // className='bg-primary-300 p-4  rounded-md text-neutral-600'
                className='bg-foreground p-4 rounded-md text-xs text-background sm:text-sm'
                style={{
                  borderTopLeftRadius: detailsId === 1 ? "0px" : "0.375rem",
                }}
              >
                <p className={`${detailsId !== 1 && "hidden"}`}>
                  Questi cookie sono necessari per il funzionamento del sito web e non possono essere disattivati nei nostri sistemi.
                </p>
                <p className={`${detailsId !== 2 && "hidden"}`}>
                  Questi cookie consentono al sito web di ricordare le scelte effettuate dall’utente e forniscono funzionalità avanzate personalizzate.
                </p>
                <p className={`${detailsId !== 3 && "hidden"}`}>
                  Questi cookie ci consentono di contare le visite e le fonti di traffico, per poter misurare e migliorare le prestazioni del nostro sito.
                </p>
                <p className={`${detailsId !== 4 && "hidden"}`}>
                  Questi cookie possono essere impostati attraverso il nostro sito dai nostri partner pubblicitari. Possono essere utilizzati da queste aziende per creare un profilo dei tuoi interessi e mostrarti annunci pertinenti su altri siti. Non memorizzano direttamente informazioni personali, ma si basano sull’identificazione univoca del browser e del dispositivo Internet. Se non consenti questi cookie, sperimenterai pubblicità meno mirate.
                </p>
                <p>
                  {/* Vai alla lista di cookies <a href='/policies' target="_blank" className='font-semibold'>qui</a> */}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-4 text-xs lg:text-sm md:whitespace-nowrap lg:flex-col">
            <button
              onClick={(e) => {
                handleSubmit(e, "all");
              }}
              id="cookies-close"
              className="px-4 py-2 bg-primary text-white font-medium rounded-md shadow-lg hover:scale-105 lg:px-2"
            >
              Accetta tutti
            </button>
            <button
              onClick={(e) => {
                handleSubmit(e, "selected");
              }}
              id="cookies-close"
              // className="font-semibold underline hover:scale-105"
              className="px-4 py-2 bg-primary text-white font-medium rounded-md shadow-lg hover:scale-105 lg:px-2"
            >
              Accetta selezionati
            </button>
            <button
              onClick={(e) => {
                handleSubmit(e, "none");
              }}
              id="cookies-close"
              // className="font-semibold underline hover:scale-105"
              className="px-4 py-2 bg-primary text-white font-medium rounded-md shadow-lg hover:scale-105 lg:px-2"
            >
              Chiudi senza accettare
            </button>
          
          </div>
        </div>
        <button
          onClick={(e) => {
            handleSubmit(e, "none");
          }}
          id="cookies-close"
          className="absolute top-0 right-0 p-1 w-fit text-foreground font-medium rounded-md text-xl"
        >
          <X />
        </button>
      </div>
    </div>
  );
}

export default CookiesBanner;
