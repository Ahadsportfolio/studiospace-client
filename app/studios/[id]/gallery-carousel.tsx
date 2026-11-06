"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface GalleryCarouselProps {
  title: string;
  category: string;
  images: string[];
}

const FALLBACK_STUDIO_IMAGE =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop";

export function GalleryCarousel({
  title,
  category,
  images,
}: GalleryCarouselProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Ensure at least one image is available
  const photoList =
    Array.isArray(images) && images.length > 0
      ? images
      : [FALLBACK_STUDIO_IMAGE];

  return (
    <div className="w-full">
      {/* Main Swiper Container */}
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-base-300 bg-base-300 shadow-lg sm:aspect-[16/9]">
        <Swiper
          modules={[Navigation, Pagination, Keyboard, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          keyboard={{ enabled: true }}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-full w-full"
        >
          {photoList.map((photoUrl, idx) => (
            <SwiperSlide key={`${photoUrl}-${idx}`} className="relative h-full w-full">
              <div className="relative h-full w-full bg-base-300">
                <Image
                  src={photoUrl || FALLBACK_STUDIO_IMAGE}
                  alt={`${title} - View ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover"
                  unoptimized={
                    !photoUrl.includes("images.unsplash.com") &&
                    !photoUrl.includes("i.ibb.co")
                  }
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== FALLBACK_STUDIO_IMAGE) {
                      target.src = FALLBACK_STUDIO_IMAGE;
                    }
                  }}
                />
                {/* Subtle vignette gradient for text contrast */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Top Badges Overlay */}
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {category}
          </span>
        </div>

        {/* Top Right Actions: Photo counter & Fullscreen trigger */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-medium text-white shadow-md backdrop-blur-md">
            Photo {activeIndex + 1} of {photoList.length}
          </span>
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="View photo in lightbox modal"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-md backdrop-blur-md transition-all hover:bg-black/80 hover:scale-105"
          >
            <Expand size={14} />
          </button>
        </div>

        {/* Carousel Navigation Arrows (Visible when > 1 slide) */}
        {photoList.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => swiperInstance?.slidePrev()}
              aria-label="Previous studio photo"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-black/85 hover:scale-110 active:scale-95 disabled:opacity-40"
              disabled={activeIndex === 0}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => swiperInstance?.slideNext()}
              aria-label="Next studio photo"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-black/85 hover:scale-110 active:scale-95 disabled:opacity-40"
              disabled={activeIndex === photoList.length - 1}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row (when more than 1 image) */}
      {photoList.length > 1 && (
        <div className="mt-3.5 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {photoList.map((thumbUrl, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={`thumb-${thumbUrl}-${idx}`}
                type="button"
                onClick={() => {
                  swiperInstance?.slideTo(idx);
                  setActiveIndex(idx);
                }}
                className={`group relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 sm:h-20 sm:w-28 ${
                  isCurrent
                    ? "border-primary ring-2 ring-primary/40 scale-102"
                    : "border-base-300 opacity-70 hover:opacity-100 hover:border-base-content/40"
                }`}
                aria-label={`Jump to photo ${idx + 1}`}
              >
                <Image
                  src={thumbUrl || FALLBACK_STUDIO_IMAGE}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized={
                    !thumbUrl.includes("images.unsplash.com") &&
                    !thumbUrl.includes("i.ibb.co")
                  }
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== FALLBACK_STUDIO_IMAGE) {
                      target.src = FALLBACK_STUDIO_IMAGE;
                    }
                  }}
                />
                {isCurrent && (
                  <div className="absolute inset-0 bg-primary/10 ring-inset" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-lg animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close preview modal"
            className="absolute right-6 top-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105"
          >
            <X size={22} />
          </button>

          <div className="relative flex max-h-[85vh] max-w-5xl flex-col items-center">
            <div className="relative aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-neutral-900 shadow-2xl">
              <Image
                src={photoList[activeIndex] || FALLBACK_STUDIO_IMAGE}
                alt={`${title} - Full size preview`}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
                unoptimized={
                  !photoList[activeIndex].includes("images.unsplash.com") &&
                  !photoList[activeIndex].includes("i.ibb.co")
                }
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-neutral-300">
              <span>{title}</span>
              <span>
                {activeIndex + 1} / {photoList.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
