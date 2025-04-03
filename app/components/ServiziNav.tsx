"use client";

import React, { useEffect, useState } from 'react'
import { fullService } from '../lib/interface';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

type Props = {
  services: fullService[],
  isGlobal: boolean,
}

function ServiziNav({services, isGlobal} : Props) {
  // Parte servizi
  const [inView, setInView] = useState<string>('service-track-' + services[0].id);
  const [trackerIds, setTrackerIds] = useState<string[]>(services.map(service => `service-track-${service.id}`));

  const router = useRouter();
  const pathname = usePathname();

  const linkCallback = () => {
    // setIsNavOpen(false);
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`service-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  
  useEffect(() => {
    setTrackerIds(services.map(service => `service-track-${service.id}`));
    console.log({trackerIds});
    let sections: (HTMLElement | null)[] = [];

    trackerIds.forEach(id => {
      let section = document.getElementById(id)
      if (section) {
        sections.push(section);
      }
    });

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
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
  }, [services])

  useEffect(() => {
    console.log({inView});
  }, [inView])

  return(services.length > 0 && ( 

      <div className="mx-auto w-full max-w-7xl">
        {/* Navbar dei servizi */}
        {/* Desktop */}
        <div className="hidden xl:flex fixed top-0 left-0 pt-[4.5rem] pb-2 z-20 w-[100dvw]  items-start lg:items-center xl:justify-around bg-background duration-200 ease-in-out border-primary border-b-[1px]">
          {/* <ServiziNav services={services} inView={inView} /> */}
          <div className="flex flex-col xl:flex-row p-2 gap-1 xl:p-0 xl:gap-0 font-semibold text-xs xl:text-sm">
            {/* <div>
              <a href={"#id-0"}>
                <span className={"hover:text-primary uppercase " + (inView == "tracker-0" ? "text-primary" : "")}>Tutti</span>
              </a>
              <span className="mx-1 hidden xl:inline-block">|</span>
            </div> */}
            {services.map((service, index) => (
              <div key={index} >
                {isGlobal ?
                  <span onClick={()=>{scrollToSection(service.id); linkCallback ? linkCallback() : ()=>{}}} className='cursor-pointer'>
                    <span className={"hover:text-primary uppercase whitespace-nowrap " + (inView == ("service-track-" + service.id) ? "text-primary" : "")}>{service.title}</span>
                  </span>
                  :
                  <a href={'/servizi/' + service.currentSlug} onClick={()=>{scrollToSection(service.id); linkCallback ? linkCallback() : ()=>{}}} className='cursor-pointer'>
                    <span className={"hover:text-primary uppercase whitespace-nowrap " + (pathname.includes(service.currentSlug) ? "text-primary" : "")}>{service.title}</span>
                  </a>
                }
                {index < services.length - 1 && <span className="mx-1 hidden xl:inline-block">|</span>}
              </div>
            ))}
          </div>
  
        </div>
        {/* Mobile */}
        <div className="xl:hidden">
          {/* <div className="fixed top-0 pt-[4.5rem] pb-4 z-10 w-[100dvw] flex items-start lg:items-center xl:justify-around bg-gradient-to-b from-[#000000bf] via-[#000000bf] via-[5.5rem] to-transparent to-[6.5rem] duration-200 ease-in-out"> */}
          <div className="fixed top-0 right-0 left-0 pt-[4.5rem] pb-4 px-8 z-20 flex justify-end lg:items-center xl:justify-around duration-200 ease-in-out">
            

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <span>Lista servizi</span>
                  {/* <span className="sr-only">Toggle theme</span> */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded bg-background border p-4 mt-2" align="end">
                {!isGlobal && 
                  <>
                    <DropdownMenuItem className='cursor-pointer p-1 rounded text-sm font-semibold uppercase whitespace-nowrap hover:text-primary hover:bg-accent' 
                      onClick={()=>router.push('/servizi')}
                    >
                      <span>Tutti i servizi</span>
                    </DropdownMenuItem>
                    <hr />
                  </>
                }
                <DropdownMenuGroup>
                  {services.map((service, index) => (
                    <DropdownMenuItem key={index} className='cursor-pointer p-1 rounded text-sm font-semibold uppercase whitespace-nowrap hover:text-primary hover:bg-accent' 
                      onClick={isGlobal 
                        ? () => {scrollToSection(service.id); } 
                        : () => {console.log('/servizi/' + service.currentSlug); router.push('/servizi/' + service.currentSlug);}}
                    >
                      <span className={isGlobal 
                        ? (inView == ("service-track-" + service.id) ? "text-primary" : "")
                        : (pathname.includes(service.currentSlug) ? "text-primary" : "")  
                      }>{service.title}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
              
          </div>
        </div>
      </div>
    )
  )


}


  // function ServiziNav({services, inView, linkCallback = null, isGlobal} : Props) {

  // const scrollToSection = (id: string) => {
  //   const element = document.getElementById(`service-${id}`);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  // return (services &&
  //   <div className="flex flex-col xl:flex-row p-2 gap-1 xl:p-0 xl:gap-0 font-semibold text-xs xl:text-sm">
        
  //     <div>
  //       <a href={"#id-0"} onClick={linkCallback ? linkCallback : ()=>{}}>
  //         <span className={"hover:text-primary uppercase " + (inView == "tracker-0" ? "text-primary" : "")}>Tutti</span>
  //       </a>
  //       <span className="mx-1 hidden xl:inline-block">|</span>
  //     </div>

  //     {services.map((service, index) => (
        
  //       <div key={index} >
  //         {isGlobal ?
  //           <span onClick={()=>{scrollToSection(service.id); linkCallback ? linkCallback() : ()=>{}}} className='cursor-pointer'>
  //             <span className={"hover:text-primary uppercase whitespace-nowrap " + (inView == ("tracker-" + service.id) ? "text-primary" : "")}>{service.title}</span>
  //           </span>
  //           :
  //           <a href={'/servizi/' + service.currentSlug} onClick={()=>{scrollToSection(service.id); linkCallback ? linkCallback() : ()=>{}}} className='cursor-pointer'>
  //             <span className={"hover:text-primary uppercase whitespace-nowrap " + (inView == ("tracker-" + service.id) ? "text-primary" : "")}>{service.title}</span>
  //           </a>
  //         }
  //         {index < services.length - 1 && <span className="mx-1 hidden xl:inline-block">|</span>}
  //       </div>

  //     ))}
  //   </div>
  // )
// }

export default ServiziNav