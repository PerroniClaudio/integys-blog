"use client";
// export const dynamic = "force-dynamic";

import Newsletter from "@/components/ui/newsletter";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import ServiziNav from "../components/ServiziNav";
import { Menu, X } from "lucide-react";
import ContactUs from "@/components/ui/contact-us";



const services = [
  { 
    id: 1,
    title: 'Security Assesment',
    short: "Per valutare la sicurezza informatica di un'organizzazione.",
    description: [
      "È un processo fondamentale atto a fornire una panoramica completa per valutare la sicurezza informatica di un'organizzazione. Si tratta di un'analisi approfondita dei sistemi, delle reti e delle procedure di sicurezza esistenti, volta a identificare soluzioni e policy di sicurezza per rafforzare o migliorare le difese dell'azienda.",
      "Le fasi chiave di un security assesment comprendono la raccolta di informazioni, l'identificazione delle vulnerabilità e la proposta di misure correttive.",
      "Si concentra principalmente su diverse componenti chiave tra cui il controllo degli accessi, la gestione delle password e la protezione delle informazioni sensibili con scansioni di vulnerabilità, test di infiltrazione e controllo delle politiche di sicurezza ponendo particolare enfasi sulla compliance normativa.",
      "I benefici per l'organizzazione sono molteplici: dalla riduzione del rischio di violazioni dei dati al miglioramento della conformità normativa e quindi l’aumento della fiducia dei clienti."
    ],
    imageUrl: '/servizi/security-assesment.png',
  },
  {
    id: 2,
    title: 'Vulnerability Assesment',
    short: "Per quantificare e classificare le vulnerabilità presenti nell'infrastruttura IT.",
    description: [
      "Si tratta di un'analisi sistematica volta a identificare, quantificare e classificare le vulnerabilità presenti nell'infrastruttura IT di un'organizzazione. Questo processo comprende la scansione delle reti, dei sistemi e delle applicazioni aziendali per individuare potenziali punti deboli che potrebbero essere sfruttati da malintenzionati.", 
      "Una vulnerabilità è una componente IT in cui le misure di sicurezza sono assenti, ridotte o compromesse. Questo rappresenta un punto di accesso che permette a un potenziale aggressore di iniettare codice malevolo appropriandosi dei dati sensibili o rendendoli inaccessibili, compromettendo pertanto la funzionalità dell'intero sistema informativo per giorni.",
      "Questo processo non solo aiuta a prevenire potenziali attacchi informatici, ma fornisce anche una visione chiara dello stato di sicurezza dell'infrastruttura IT aziendale. Eseguire quindi regolari valutazioni delle vulnerabilità come approccio proattivo alla sicurezza permette di ridurre i rischi operativi, proteggere i dati sensibili, salvaguardare la reputazione aziendale e prevenire costose violazioni dei dati."
    ],
    imageUrl: '/servizi/vulnerability-assesment.png',
  },
  {
    id: 3,
    title: 'Penetration test',
    short: "Una simulazione autorizzata di un attacco informatico su un sistema, rete o applicazione web.",
    description: [
      "Un test di infiltrazione è una pratica essenziale nella sicurezza informatica moderna. È una simulazione autorizzata di un attacco informatico su un sistema, rete o applicazione web. L'obiettivo principale è identificare vulnerabilità che potrebbero essere sfruttate da hacker malintenzionati.", 
      "Questo processo è particolarmente cruciale quando si tratta di proteggere la privacy e i dati di sensibili un'organizzazione. Durante il test, esperti di sicurezza, mediante applicazioni specifiche, tentano di infiltrarsi nei sistemi utilizzando le stesse tecniche dei criminali informatici, ma con l'intento di rafforzare le difese, rivelando potenziali falle nella gestione di questi dati.", 
      "Questo include la verifica di come vengono archiviati, trasmessi e acceduti i dati di informazioni personali, dati finanziari e altri asset digitali critici, in modo tale che le aziende possano identificare e correggere le vulnerabilità  prima che possano essere sfruttate in un attacco reale, garantendo così un livello superiore di protezione per la privacy dei dipendenti e dei clienti.", 
      "È uno strumento indispensabile per mantenere un'efficace e costante postura di sicurezza in un panorama di minacce in continua evoluzione."
    ],
    imageUrl: '/servizi/penetration-test.png',
  },
  {
    id: 4,
    title: 'Remediation plan',
    short: "Un piano di rimedio, essenziale nella gestione della sicurezza aziendale.",
    description: [
      "Un piano di rimedio, è uno strumento essenziale nella gestione della sicurezza aziendale. Si tratta di un documento strategico che delinea le azioni specifiche da intraprendere per affrontare e correggere le vulnerabilità o le non conformità identificate durante una valutazione della sicurezza o un audit, con lo scopo di migliorare la sicurezza complessiva di un'organizzazione.", 
      "Questo piano include tipicamente una lista prioritizzata di problemi da risolvere, le azioni correttive proposte, le tempistiche per l'implementazione e le risorse necessarie.Coinvolge diverse fasi: identificazione dei problemi, analisi delle cause radice, sviluppo di soluzioni, implementazione delle correzioni e verifica dell'efficacia delle azioni intraprese.", 
      "La sua implementazione efficace offre numerosi vantaggi per l'azienda. Non solo aiuta a ridurre i rischi di sicurezza, ma aumenta la fiducia dei clienti, fornitori e partner, e può prevenire potenziali perdite finanziarie dovute a violazioni della sicurezza."
    ],
    imageUrl: '/servizi/remediation-plan.png',
  },
  {
    id: 5,
    title: 'Risk Management',
    short: "Identificazione, valutazione e prioritizzazione dei potenziali rischi per la sicurezza.",
    description: [
      "Pilastro fondamentale di un efficace piano di security governance, la gestione del rischio implica l'identificazione, la valutazione e la prioritizzazione dei potenziali rischi per la sicurezza dell'organizzazione, come ad esempio le violazioni dei dati, gli attacchi malware o l'accesso non autorizzato ai sistemi aziendali.", 
      "Una volta identificati, occorre implementare misure di controllo e di prevenzione per ridurre la probabilità che questi rischi si concretizzino e minimizzare il loro impatto sull’azienda.", 
      "Queste misure possono includere l'uso di tecnologie adeguate (applicazioni e/o infrastrutture tecnologiche) e programmi di formazione sulla sicurezza per le persone", 
      "La gestione sistematica dei rischi di cybersecurity è fondamentale per proteggere l'integrità, la disponibilità e la riservatezza delle informazioni aziendali in un panorama di minacce in continua evoluzione." 
    ],
    imageUrl: '/servizi/risk-management.png',
  },
  {
    id: 6,
    title: 'Incident Management',
    short: "Procedure da seguire in caso di violazione della sicurezza o di altri eventi imprevisti.",
    description: [
      "Delinea le procedure da seguire in caso di violazione della sicurezza o di altri eventi imprevisti che potrebbero compromettere la sicurezza dei dati aziendali o la non operatività dell’azienda.", 
      "Definisce chiaramente i ruoli e le responsabilità del personale coinvolto, stabilisce protocolli di comunicazione e prevede passaggi specifici per contenere, mitigare e recuperare da un incidente di sicurezza.", 
      "Include la formazione del personale per riconoscere e segnalare potenziali minacce, l'istituzione di un team dedicato alla gestione degli incidenti e la definizione di procedure per contenere, analizzare e risolvere rapidamente eventuali problemi di sicurezza.", 
      "La prontezza nella risposta agli incidenti può fare la differenza tra un evento gestibile e una crisi di vasta portata."
    ],
    imageUrl: '/servizi/incident-management.png',
  },
  {
    id: 7,
    title: 'Security Governance',
    short: "Linee guida, procedure e controlli progettati per proteggere le risorse dell'organizzazione.",
    description: [
      "La security governance è un framework essenziale, la spina dorsale della sicurezza aziendale che sostiene un'organizzazione nella gestione e nella protezione dei propri dati nel complesso panorama della Cybersecurity.", 
      "Si tratta di un insieme di linee guida, procedure e controlli progettati per proteggere le risorse dell'organizzazione, inclusi dati sensibili e sistemi informatici.", 
      "Questo piano definisce le politiche, le procedure e le responsabilità necessarie per proteggere le risorse digitali dell'azienda e mitigare i rischi informatici.", 
      "È fondamentale perché attraverso l'implementazione delle politiche di sicurezza definisce come interagire in modo sicuro con le informazioni aziendali e garantire la compliance, ovvero il rispetto delle normative e degli standard di sicurezza." 
    ],
    imageUrl: '/servizi/security-governance.png',
  },
];

const trackerIds = [...services.map(service => `tracker-${service.id}`), "tracker-0"];

export default function Home() {

  const [inView, setInView] = useState<string>('tracker-0');
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  useEffect(() => {
    let sections: (HTMLElement | null)[] = [];
    let first = document.getElementById("tracker-0");

    sections.push(first);
    trackerIds.forEach(id => {
      let section = document.getElementById(id)
      if (section) {
        sections.push(section);
      }
    });
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          if (trackerIds.includes(entry.target.id)) {
            setInView(entry.target.id);
          }
        }
      })
    }, observerOptions)
    
    sections?.forEach(section => {
      section && observer.observe(section)
    })
  }, [])

  useEffect(() => {
    if (isNavOpen) {
      document.body.classList.add("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isNavOpen])

  return (
    <>
      {/* <Hero /> */}
      {/* <main className="max-w-7xl mx-auto px-4 mb-16 mt-20"> */}
      <main className="">
          {/* <div className="grid grid-cols-1 lg:grid-cols-8 gap-5"> */}
          <div className="hidden xl:block">
            <div className="fixed top-0 pt-[4.5rem] pb-4 z-10 w-[100dvw] flex items-start lg:items-center xl:justify-around bg-gradient-to-b from-white/60 via-white/60 dark:from-black/80 dark:via-black/80 via-[5.5rem] to-transparent to-[6.5rem] duration-200 ease-in-out">
              {/* Dà errore perchè è stato modificato il componente ServiziNav */}
              {/* <ServiziNav services={services} inView={inView} /> */}
            </div>
          </div>
          <div className="xl:hidden">
            {/* <div className="fixed top-0 pt-[4.5rem] pb-4 z-10 w-[100dvw] flex items-start lg:items-center xl:justify-around bg-gradient-to-b from-[#000000bf] via-[#000000bf] via-[5.5rem] to-transparent to-[6.5rem] duration-200 ease-in-out"> */}
            <div className="fixed top-0 right-0 pt-[4.5rem] pb-4 z-10 w-[100dvw] flex items-start lg:items-center xl:justify-around duration-200 ease-in-out">
            <button
              onClick={(e) => setIsNavOpen(true)}
              className="ml-auto mr-4 p-2 rounded-md bg-background border border-primary hover:bg-background/50 text-content">
              <Menu />
            </button>
            {isNavOpen && (
              <section className="fixed z-50 inset-0">
                <div
                id="sidenav"
                className={`fixed inset-0 bg-white/20 backdrop-blur-sm`}>
                  <div
                    className={`fixed top-20 right-4 w-fit max-w-xs bg-white/70 rounded-lg shadow-lg p-6 text-base font-semibold text-slate-900`}>
                    <button
                      type="button"
                      id="sidenav-dismiss"
                      className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-slate-900 hover:text-slate-600"
                      onClick={(e) => setIsNavOpen(false)}>
                        {/* Chiudi */}
                      <X />
                      {/* <span className="sr-only">Close navigation</span> */}
                    </button>
                    {/* Dà errore perchè è stato modificato il componente ServiziNav */}
                    {/* <ServiziNav services={services} inView={inView} linkCallback={() => setIsNavOpen(false)} /> */}
                  </div>
                </div>
              </section>
            )}
            </div>
          </div>

          <div className="relative flex flex-col h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory w-[100svw]">
          {/* <div className="relative flex flex-col h-screen overflow-y-scroll"> */}

            <div className="snap-start">

              <div id="id-0"></div>
              <div className="h-[100svh] w-full relative bg-[url('/servizi/index.png')] bg-cover flex items-center">
                
                <div className="w-full flex flex-col items-center gap-10">
                  <h2 className="text-3xl font-bold m-auto text-primary">I NOSTRI SERVIZI</h2>
                  
                  <div id="tracker-0"></div>

                  <div>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-6 lg:max-w-screen-lg">
                      {services.map((service) => (
                        <a href={"#id-" + service.id} key={"srvc-"+service.id} className="w-40 h-32 md:w-64 md:h-40 rounded-lg bg-[#ffffffbf] text-gray-700 shadow-lg p-4 text-center hover:scale-110 duration-150 ease-in-out">
                          <h3 className="text-sm sm:text-lg md:text-xl font-bold h-12 text-primary">{service.title}</h3>
                          <p className="text-xs md:text-sm mt-0 sm:mt-2 md:mt-4 line-clamp-3">{service.short}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {services.map((service, index) => (
              
              <div key={index} className="snap-start">
                <div id={"id-" + service.id}></div>

                <div className="h-[100svh] relative">
                  <img
                    // src={urlFor(article.titleImage).url()}
                    src={service.imageUrl}
                    alt={service.title}
                    width={500}
                    height={500}
                    // className="rounded-t-lg h-[200px] w-full object-cover"
                    className="h-full w-full object-cover"
                  />
                  <div className="w-full p-8 mt-5 absolute bottom-0 bg-gradient-to-t from-white/60 via-white/60 dark:from-black/80 dark:via-black/80 via-85% to-transparent">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary uppercase">{service.title}</h2>
                    
                    <div id={"tracker-" + service.id}></div>
                      
                      {service.description.map((paragraph, index) => (
                        <p key={index} className="text-sm sm:text-lg md:text-xl font-semibold mt-2">
                          {paragraph}
                        </p>
                      ))}

                  </div>
                </div>
              </div>
            ))}
            <div className="snap-start">
              <ContactUs />
              {/* <Newsletter /> */}
              <Footer isAbsolute={false} />
            </div>

          </div>
      </main>
      {/* <Newsletter /> */}
    </>
  );
}
