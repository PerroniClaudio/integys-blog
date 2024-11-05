"use client";

import React from 'react'

type Service = {
  id: number,
  title: string,
  description: string[],
  imageUrl: string
}

type Props = {
  services: Service[],
  inView: string
  linkCallback?: (() => void) | null
}

function ServiziNav({services, inView, linkCallback = null} : Props) {
  return (services &&
    <div className="flex flex-col xl:flex-row p-2 gap-1 xl:p-0 xl:gap-0 font-semibold text-xs xl:text-sm">
        
      <div>
        <a href={"#id-0"} onClick={linkCallback ? linkCallback : ()=>{}}>
          <span className={"hover:text-primary uppercase" + (inView == "tracker-0" ? " text-primary" : "")}>Tutti</span>
        </a>
        <span className="mx-1 hidden xl:inline-block">|</span>
      </div>

      {services.map((service, index) => (
        
        <div key={index} >
          <a href={"#id-" + service.id} onClick={linkCallback ? linkCallback : ()=>{}}>
            <span className={"hover:text-primary uppercase whitespace-nowrap" + (inView == ("tracker-" + service.id) ? " text-primary" : "")}>{service.title}</span>
          </a>
          {index < services.length - 1 && <span className="mx-1 hidden xl:inline-block">|</span>}
        </div>

      ))}
    </div>
  )
}

export default ServiziNav