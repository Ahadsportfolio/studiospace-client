"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Keyboard, EffectFade, Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface HeroSlide {
  id: string;
  category: "Photo Studio" | "Film Stage" | "Podcast Lounge" | "Music Suite" | "Workshop";
  headline: string;
  subtext: string;
  badge: string;
  highlight: string;
  image: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "photo-studio",
    category: "Photo Studio",
    badge: "Daylight Lofts & Cyc Walls",
    headline: "Where Raw Space Meets Creative Vision",
    subtext:
      "Book daylight infinity cycs, industrial portrait lofts, and precision strobe packages curated for photographers and visual storytellers.",
    highlight: "2,200 sq ft · 24ft Infinity Cyc · Daylight Loft",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1920&auto=format&fit=crop",
    alt: "Apex Daylight Infinity Cyclorama Studio with softbox lighting and white cyc wall",
  },
  {
    id: "film-stage",
    category: "Film Stage",
    badge: "Commercial Soundstages",
    headline: "Soundstages Built for Ambitious Cinema",
    subtext:
      "Acoustically isolated stages with drive-in roll-up doors, high-density lighting grids, 400A camlock power, and dedicated talent green rooms.",
    highlight: "Silent Production HVAC · Green Screen Cyc · 400A Power",
    image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1920&auto=format&fit=crop",
    alt: "Soundstage Alpha Production Stage with overhead rigging and cinema equipment",
  },
  {
    id: "music-suite",
    category: "Music Suite",
    badge: "Dolby Atmos & Tracking",
    headline: "Acoustic Purity for Next-Level Sound",
    subtext:
      "Dolby Atmos monitoring, legendary analog consoles, vintage tube microphones, and floating isolation booths calibrated for pristine master tracks.",
    highlight: "SSL AWS Console · Genelec 7.1.4 Atmos · Vintage Mics",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1920&auto=format&fit=crop",
    alt: "Vocal Vault Dolby Atmos Recording Suite with analog console and acoustic treatment",
  },
  {
    id: "podcast-lounge",
    category: "Podcast Lounge",
    badge: "Turnkey Multi-Cam Studios",
    headline: "Broadcast-Ready Lounges for Creators",
    subtext:
      "Plug-and-play multi-camera 4K podcast suites with broadcast dynamics, acoustic wood slats, and warm architectural lighting.",
    highlight: "4x Shure SM7B · Sony 4K Tri-Cam · Live Gigabit LAN",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1920&auto=format&fit=crop",
    alt: "The Broadcaster 4-Person Video Podcast Suite with dynamic boom microphones",
  },
];

export function HomeHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const firstSlide = HERO_SLIDES[0];

  return (
    <section aria-label="Hero slider" className="relative w-full overflow-hidden">
      {!mounted ? (
        <div className="relative h-[640px] sm:h-[680px] lg:h-[760px] w-full overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={firstSlide.image}
              alt={firstSlide.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
          </div>

          {/* Slide Content */}
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pb-20 pt-16 sm:px-10 lg:px-12">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  {firstSlide.category}
                </span>
                <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm sm:inline-flex">
                  <Sparkles aria-hidden="true" size={13} className="text-accent" />
                  {firstSlide.badge}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.06] tracking-tight text-white">
                {firstSlide.headline}
              </h1>

              <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed">
                {firstSlide.subtext}
              </p>

              <div className="mt-4 inline-block rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/75 backdrop-blur-sm">
                {firstSlide.highlight}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/studios"
                  className="button-primary shadow-lg shadow-primary/25"
                >
                  <span>Explore Studios</span>
                  <ArrowUpRight aria-hidden="true" size={17} />
                </Link>

                <Link href="/studios" className="button-hero-secondary">
                  <span>Host Your Space</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Swiper
            modules={[Autoplay, Pagination, Keyboard, EffectFade, Navigation, A11y]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={800}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
            }}
            keyboard={{
              enabled: true,
              onlyInViewport: true,
            }}
            navigation={{
              prevEl: "#hero-slide-prev",
              nextEl: "#hero-slide-next",
            }}
            className="hero-swiper h-[640px] sm:h-[680px] lg:h-[760px] w-full"
          >
            {HERO_SLIDES.map((slide, index) => (
              <SwiperSlide key={slide.id} className="relative h-full w-full overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover object-center scale-[1.02] transition-transform duration-[7000ms] ease-out group-hover:scale-105"
                  />
                  {/* Cinematic Darkening Overlays for High Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                </div>

                {/* Slide Content */}
                <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pb-20 pt-16 sm:px-10 lg:px-12">
                  <div className="max-w-3xl">
                    {/* Category & Feature Pill */}
                    <div className="mb-5 flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                        {slide.category}
                      </span>
                      <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm sm:inline-flex">
                        <Sparkles aria-hidden="true" size={13} className="text-accent" />
                        {slide.badge}
                      </span>
                    </div>

                    {/* Punchy Headline */}
                    <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.06] tracking-tight text-white">
                      {slide.headline}
                    </h1>

                    {/* Subtext */}
                    <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed">
                      {slide.subtext}
                    </p>

                    {/* Highlight Specs Pill */}
                    <div className="mt-4 inline-block rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/75 backdrop-blur-sm">
                      {slide.highlight}
                    </div>

                    {/* Action CTAs */}
                    <div className="mt-8 flex flex-wrap items-center gap-3.5">
                      <Link
                        href="/studios"
                        className="button-primary shadow-lg shadow-primary/25"
                      >
                        <span>Explore Studios</span>
                        <ArrowUpRight aria-hidden="true" size={17} />
                      </Link>

                      <Link href="/studios" className="button-hero-secondary">
                        <span>Host Your Space</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Manual Slide Navigation Controls */}
          <div className="pointer-events-none absolute inset-y-0 inset-x-4 z-20 hidden items-center justify-between sm:flex lg:inset-x-8">
            <button
              id="hero-slide-prev"
              type="button"
              aria-label="Previous slide"
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-all hover:border-white/60 hover:bg-black/70 hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              id="hero-slide-next"
              type="button"
              aria-label="Next slide"
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-all hover:border-white/60 hover:bg-black/70 hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
