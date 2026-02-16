"use client";

import {Swiper, SwiperSlide} from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import HighlightedArticleCard from './HighlightedArticleCard';
import { simpleBlogCard } from '@/lib/interface';
import '../swiperStyleOverride.css';

type Props = {
  data: simpleBlogCard[];
  locale: string;
}
function HighlightedArticles({data, locale}: Props) {
  return (
    <div className='bg-popover bg-opacity-50 pt-6 lg:pt-10'>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          // el: ".swiper-pagination-custom",
        }}
        navigation={true}
        // navigation={{
        //   nextEl: `.swiper-button-next-custom`,
        //   prevEl: `.swiper-button-prev-custom`,
        // }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper pb-8"
      >
        {data.map((post, index) => 
          <SwiperSlide key={post.id} className='h-auto mb-8'>
            <HighlightedArticleCard key={post.id} article={post} index={index} locale={locale} />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  )
}

export default HighlightedArticles