"use client";

import { blogCardListElement } from '@/lib/interface';
import { urlFor } from '@/lib/sanity';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

function ArticlesList({data}: {data: blogCardListElement[]}) {
  const [search, setSearch] = useState<string>('');
  const [filteredData, setFilteredData] = useState<blogCardListElement[]>(data || []);
  const [pageData, setPageData] = useState<blogCardListElement[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [limit, setLimit] = useState<number>(10);

  // Si potrebbe migliorare utilizzando un'api con ricerca e pagination al posto di ricevere direttamente tutti gli articoli

  function handleSearch (value: string) {
    setSearch(value);
    if (value === '') {
      setFilteredData(data);
      setPage(1);
    } else {
      const filtered = data.filter(article => article.title.toLowerCase().includes(value.toLowerCase()));
      setFilteredData(filtered);
      setPage(1);
    }
  }

  useEffect(() => {
    if(filteredData){
      setPageData(filteredData.slice((page-1)*perPage, page*perPage));
      setLimit(Math.ceil(filteredData.length/perPage));
    }
  }, [filteredData, page, perPage])

  return (
    <div>
      <div className='w-fit ml-auto'>
        <label htmlFor="search" className='font-semibold mr-4'>Cerca</label>
        <input id='search' type="text" className='input p-2 bg-input rounded'
          value={search}
          onChange={(e)=>handleSearch(e.target.value)}
        />
      </div>
      {/* Risultati */}
      <div className="w-[90svw] mt-8 flex flex-col gap-2 items-center lg:max-w-screen-lg">
        {!!pageData && pageData.map((article: blogCardListElement) => (
          <div key={article.id} className="w-full p-1 rounded flex items-center gap-4 justify-between hover:bg-secondary">
            <div className="w-full flex items-center gap-4">
              <Image
                src={article.titleImage ? (urlFor(article.titleImage).url() || "/opengraph-integys.png") : "/opengraph-integys.png"}
                alt={article.title}
                width={100}
                height={100}
                priority
                className="rounded-lg border shadow-sm"
              />
              <h3 className="font-semibold">
                {article.title}
              </h3>
            </div>
            <Link href={`/admin/article-preview/${article.currentSlug}`}>
              <Button>
                Anteprima
              </Button>
            </Link>
          </div>
        ))}
        <div className='w-full flex gap-2 justify-end items-center mt-4'>
          <div>
            <label htmlFor="per_page">Per pagina</label>
            <select name="per_page" id="per_page" value={perPage} onChange={(e)=>setPerPage(Number(e.target.value))}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>
          <Button className='h-fit py-1 px-2' onClick={()=>{setPage(1)}} disabled={page == 1}><ChevronFirst/></Button>
          <Button className='h-fit py-1 px-2' onClick={()=>{setPage(prev => prev - 1)}} disabled={page == 1}><ChevronLeft/></Button>
          <div>
            Pagina {page} di {limit}
          </div>
          <Button className='h-fit py-1 px-2' onClick={()=>{setPage(prev => prev + 1)}} disabled={page == limit}><ChevronRight/></Button>
          <Button className='h-fit py-1 px-2' onClick={()=>{setPage(limit)}} disabled={page == limit}><ChevronLast/></Button>
        </div>
      </div>
    </div>
  )
}

const ImageBlock = ({ value }: any) => {
  const { asset } = value;
  if (!asset) {
    // Gestisci il caso in cui l'asset non è disponibile
    return null;
  }

  const imageUrl = urlFor(asset).url();

  return (
    <Image src={imageUrl} alt={value.alt || 'Immagine'} width={800} height={1000} />
  );
};

export default ArticlesList