"use client";
// export const dynamic = "force-dynamic";

import Newsletter from "@/components/ui/newsletter";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import ServiziNav from "../components/ServiziNav";



const services = [
  { 
    id: 1,
    title: 'Security Assesment',
    description: [
      "È un processo fondamentale atto a fornire una panoramica completa per", 
      "valutare la sicurezza informatica di un'organizzazione. Si tratta di un'analisi approfondita dei sistemi, delle reti e delle procedure di sicurezza esistenti, volta a identificare soluzioni e policy di sicurezza per rafforzare o migliorare le difese dell'aziendanLe fasi chiave di un security assesment comprendono la raccolta di informazioni, l'identificazione delle vulnerabilità e la proposta di misure correttive.",
      "Si concentra principalmente su diverse componenti chiave tra cui il controllo degli accessi, la gestione delle password e la protezione delle informazioni sensibili con scansioni di vulnerabilità, test di infiltrazione e controllo delle politiche di sicurezza ponendo particolare enfasi sulla compliance normativa.",
      "I benefici per l'organizzazione sono molteplici: dalla riduzione del rischio di violazioni dei dati al miglioramento della conformità normativa e quindi l’aumento della fiducia dei clienti."
    ],
    imageUrl: '/servizi/security-assesment.png',
  },
  {
    id: 2,
    title: 'Vulnerability Assesment',
    description: [
      "Si tratta di un'analisi sistematica volta a identificare, quantificare e classificare le vulnerabilità presenti nell'infrastruttura IT di un'organizzazione. Questo processo comprende la scansione delle reti, dei sistemi e delle applicazioni aziendali per individuare potenziali punti deboli che potrebbero essere sfruttati da malintenzionati.", 
      "Una vulnerabilità è una componente IT in cui le misure di sicurezza sono assenti, ridotte o compromesse. Questo rappresenta un punto di accesso che permette a un potenziale aggressore di iniettare codice malevolo appropriandosi dei dati sensibili o rendendoli inaccessibili, compromettendo pertanto la funzionalità dell'intero sistema informativo per giorni.",
      "Questo processo non solo aiuta a prevenire potenziali attacchi informatici, ma fornisce anche una visione chiara dello stato di sicurezza dell'infrastruttura IT aziendale. Eseguire quindi regolari valutazioni delle vulnerabilità come approccio proattivo alla sicurezza permette di ridurre i rischi operativi, proteggere i dati sensibili, salvaguardare la reputazione aziendale e prevenire costose violazioni dei dati."
    ],
    imageUrl: '/servizi/security-assesment.png',
  },
  {
    id: 3,
    title: 'Penetration test',
    description: [
      "Un test di infiltrazione è una pratica essenziale nella sicurezza informatica moderna. È una simulazione autorizzata di un attacco informatico su un sistema, rete o applicazione web. L'obiettivo principale è identificare vulnerabilità che potrebbero essere sfruttate da hacker malintenzionati.", 
      "Questo processo è particolarmente cruciale quando si tratta di proteggere la privacy e i dati di sensibili un'organizzazione. Durante il test, esperti di sicurezza, mediante applicazioni specifiche, tentano di infiltrarsi nei sistemi utilizzando le stesse tecniche dei criminali informatici, ma con l'intento di rafforzare le difese, rivelando potenziali falle nella gestione di questi dati.", 
      "Questo include la verifica di come vengono archiviati, trasmessi e acceduti i dati di informazioni personali, dati finanziari e altri asset digitali critici, in modo tale che le aziende possano identificare e correggere le vulnerabilità  prima che possano essere sfruttate in un attacco reale, garantendo così un livello superiore di protezione per la privacy dei dipendenti e dei clienti.", 
      "È uno strumento indispensabile per mantenere un'efficace e costante postura di sicurezza in un panorama di minacce in continua evoluzione."
    ],
    imageUrl: '/servizi/security-assesment.png',
  },
  {
    id: 4,
    title: 'Remediation plan',
    description: [
      "Un piano di rimedio, è uno strumento essenziale nella gestione della sicurezza aziendale. Si tratta di un documento strategico che delinea le azioni specifiche da intraprendere per affrontare e correggere le vulnerabilità o le non conformità identificate durante una valutazione della sicurezza o un audit, con lo scopo di migliorare la sicurezza complessiva di un'organizzazione.", 
      "Questo piano include tipicamente una lista prioritizzata di problemi da risolvere, le azioni correttive proposte, le tempistiche per l'implementazione e le risorse necessarie.Coinvolge diverse fasi: identificazione dei problemi, analisi delle cause radice, sviluppo di soluzioni, implementazione delle correzioni e verifica dell'efficacia delle azioni intraprese.", 
      "La sua implementazione efficace offre numerosi vantaggi per l'azienda. Non solo aiuta a ridurre i rischi di sicurezza, ma aumenta la fiducia dei clienti, fornitori e partner, e può prevenire potenziali perdite finanziarie dovute a violazioni della sicurezza."
    ],
    imageUrl: '/servizi/security-assesment.png',
  },
  {
    id: 5,
    title: 'Risk Management',
    description: [
      "Pilastro fondamentale di un efficace piano di security governance, la gestione del rischio implica l'identificazione, la valutazione e la prioritizzazione dei potenziali rischi per la sicurezza dell'organizzazione, come ad esempio le violazioni dei dati, gli attacchi malware o l'accesso non autorizzato ai sistemi aziendali.", 
      "Una volta identificati, occorre implementare misure di controllo e di prevenzione per ridurre la probabilità che questi rischi si concretizzino e minimizzare il loro impatto sull’azienda.", 
      "Queste misure possono includere l'uso di tecnologie adeguate (applicazioni e/o infrastrutture tecnologiche) e programmi di formazione sulla sicurezza per le persone", 
      "La gestione sistematica dei rischi di cybersecurity è fondamentale per proteggere l'integrità, la disponibilità e la riservatezza delle informazioni aziendali in un panorama di minacce in continua evoluzione." 
    ],
    imageUrl: '/servizi/security-assesment.png',
  },
  {
    id: 6,
    title: 'Incident Management',
    description: [
      "Delinea le procedure da seguire in caso di violazione della sicurezza o di altri eventi imprevisti che potrebbero compromettere la sicurezza dei dati aziendali o la non operatività dell’azienda.", 
      "Definisce chiaramente i ruoli e le responsabilità del personale coinvolto, stabilisce protocolli di comunicazione e prevede passaggi specifici per contenere, mitigare e recuperare da un incidente di sicurezza.", 
      "Include la formazione del personale per riconoscere e segnalare potenziali minacce, l'istituzione di un team dedicato alla gestione degli incidenti e la definizione di procedure per contenere, analizzare e risolvere rapidamente eventuali problemi di sicurezza.", 
      "La prontezza nella risposta agli incidenti può fare la differenza tra un evento gestibile e una crisi di vasta portata."
    ],
    imageUrl: '/servizi/security-assesment.png',
  },
  {
    id: 7,
    title: 'Security Governance',
    description: [
      "La security governance è un framework essenziale, la spina dorsale della sicurezza aziendale che sostiene un'organizzazione nella gestione e nella protezione dei propri dati nel complesso panorama della Cybersecurity.", 
      "Si tratta di un insieme di linee guida, procedure e controlli progettati per proteggere le risorse dell'organizzazione, inclusi dati sensibili e sistemi informatici.", 
      "Questo piano definisce le politiche, le procedure e le responsabilità necessarie per proteggere le risorse digitali dell'azienda e mitigare i rischi informatici.", 
      "È fondamentale perché attraverso l'implementazione delle politiche di sicurezza definisce come interagire in modo sicuro con le informazioni aziendali e garantire la compliance, ovvero il rispetto delle normative e degli standard di sicurezza." 
    ],
    imageUrl: '/servizi/security-assesment.png',
  },
];

const ids = services.map(service => `id-${service.id}`);

// export const revalidate = 30;

export default function Home() {

  const [inView, setInView] = useState<string>('id-1');

  useEffect(() => {
    console.log("effect");
    const handleScrollServizi = () => {
      console.log("scroll");
    };

    window.addEventListener("scroll", handleScrollServizi);

    return () => {
      window.removeEventListener("scroll", handleScrollServizi);
    };
  }, [ids]);

  return (
    <>
      {/* <Hero /> */}
      {/* <main className="max-w-7xl mx-auto px-4 mb-16 mt-20"> */}
      <main className="">
          {/* <div className="grid grid-cols-1 lg:grid-cols-8 gap-5"> */}
          {/* <div className="relative flex flex-col h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"> */}
          <div className="relative flex flex-col h-screen overflow-y-scroll">

            <div className="fixed top-0 pt-[4.2rem] pb-2 z-10 font-semibold w-[100dvw] flex justify-around bg-gradient-to-b from-[#000000bf] via-[#000000bf] via-[5rem] to-transparent to-[6rem]">
              <ServiziNav services={services} inView={inView} />
            </div>
            
            {services.map((service, index) => (
              
              <div key={index} className="">
                <div id={"id-" + service.id}></div>

                <div className="h-[100svh] relative">
                  {/* <Image
                    // src={urlFor(article.titleImage).url()}
                    src={service.imageUrl}
                    alt={service.title}
                    width={500}
                    height={500}
                    // className="rounded-t-lg h-[200px] w-full object-cover"
                    className="rounded-t-lg h-full w-full object-cover"
                  /> */}
                  <img
                    // src={urlFor(article.titleImage).url()}
                    src={service.imageUrl}
                    alt={service.title}
                    width={500}
                    height={500}
                    // className="rounded-t-lg h-[200px] w-full object-cover"
                    className="rounded-t-lg h-full w-full object-cover"
                  />
                  {/* <div className="p-8 mt-5 absolute bottom-0 bg-black bg-opacity-40"> */}
                  {/* <div className="p-8 mt-5 absolute bottom-0 bg-gradient-to-t from-black to-transparent bg-opacity-40"> */}

                  {/* <div className="absolute top-0 w-[100dvw] h-32 bg-gradient-to-b from-[#000000bf] via-[#000000bf] via-[5rem] to-transparent to-[7rem]"></div> */}

                  <div className="w-[svw] p-8 mt-5 absolute bottom-0 bg-gradient-to-t from-[#000000bf] via-[#000000bf] via-80% to-transparent">
                    <h2 className="text-3xl font-bold">{service.title}</h2>
                    
                      {service.description.map((paragraph, index) => (
                        <p key={index} className="text-lg font-semibold mt-2">
                          {paragraph}
                        </p>
                      ))}

                  </div>
                </div>


                {/* <div>
                  <Card className="h-[70svh] relative">
                    <Image
                      // src={urlFor(article.titleImage).url()}
                      src={service.imageUrl}
                      alt={service.title}
                      width={500}
                      height={500}
                      // className="rounded-t-lg h-[200px] w-full object-cover"
                      className="rounded-t-lg h-full w-full object-cover"
                    />
                    <CardContent className="mt-5 absolute bottom-0 bg-black bg-opacity-40">
                      <h2 className="text-xl font-bold">{service.title}</h2>
                      
                        {service.description.map((paragraph, index) => (
                          <p key={index} className="text-lg mt-2 ">
                            {paragraph}
                          </p>
                        ))}

                    </CardContent>
                  </Card>
                </div> */}


                {/* <MotionDiv
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 1, duration: 0.5, ease: "easeInOut" }}
                  viewport={{ amount: 0 }}>
                  <Card className="h-[70svh]">
                    <Image
                      // src={urlFor(article.titleImage).url()}
                      src={service.imageUrl}
                      alt={service.title}
                      width={500}
                      height={500}
                      // className="rounded-t-lg h-[200px] w-full object-cover"
                      className="rounded-t-lg h-[200px] w-full object-cover"
                    />
                    <CardContent className="mt-5">
                      <h3 className="text-lg line-clamp-2 font-bold">{service.title}</h3>
                      
                        {service.description.map((paragraph, index) => (
                          <p key={index} className="text-sm mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
                            {paragraph}
                          </p>
                        ))}

                    </CardContent>
                  </Card>
                </MotionDiv> */}
                

              </div>
            ))}
            <div className="snap-start">
              <Newsletter />
              <Footer isAbsolute={false} />
            </div>

          </div>
      </main>
      {/* <Newsletter /> */}
    </>
  );
}
