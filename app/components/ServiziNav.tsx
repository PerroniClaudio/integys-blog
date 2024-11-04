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
}

function ServiziNav({services, inView} : Props) {
  return (services &&
    <div className="flex">
      {services.map((service, index) => (
        
        <div key={index} >
          <a href={"#id-" + service.id}>
            {/* <span className={inView == "id-" + service.id ? "text-primary" : ""}>{service.title}</span> */}
            <span className="">{service.title}</span>
          </a>
          {index < services.length - 1 && <span className="mx-1">|</span>}
        </div>
      ))}
    </div>
  )
}

export default ServiziNav