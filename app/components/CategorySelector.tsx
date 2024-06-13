"use client";

import { useRouter } from 'next/navigation';
import React from 'react'

type Params =  {
  categories: { name: string, slug: string }[], 
  selected: string, 
  limited?: boolean
}

function CategorySelector({ categories, selected, limited = false }: Params) {

  const router = useRouter();

  return (
    <select 
      className='min-w-fit border border-border bg-input rounded-md px-2 py-2 w-1/2 md:w-1/4'
      defaultValue={selected}
      onChange={(e)=>e.target.value == "tutte" ? router.push(limited ? `/riservata` : `/`) : router.push(limited ? `/riservata/categorie/${e.target.value}` : `/categorie/${e.target.value}`)}
    >
      <option value="tutte">Tutte</option>
      {categories.map((category, idx) => (
        <option value={category.slug} key={idx}>{category.name}</option>
      ))}
    </select>
  )
}

export default CategorySelector