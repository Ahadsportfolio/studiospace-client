"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star, Users } from "lucide-react";
import type { Studio } from "@/types/studio";

interface StudioCardProps {
  studio: Studio;
}

export function StudioCard({ studio }: StudioCardProps) {
  const [imgSrc, setImgSrc] = useState(
    studio.image ||
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-300">
        <Image
          src={imgSrc}
          alt={studio.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => {
            setImgSrc(
              "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"
            );
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25"
        />
        <span className="absolute left-3.5 top-3.5 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {studio.category}
        </span>
        <span className="absolute right-3.5 top-3.5 z-10 inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/95 px-2.5 py-1 text-xs font-bold text-neutral-900 shadow-sm backdrop-blur-md">
          <Star
            size={13}
            aria-hidden="true"
            className="fill-amber-500 text-amber-500"
          />
          <span>{Number(studio.rating || 0).toFixed(1)}</span>
          {typeof studio.reviewCount === "number" && studio.reviewCount > 0 && (
            <span className="text-[10px] font-medium text-neutral-500">
              ({studio.reviewCount})
            </span>
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {studio.category}
          </span>
          {studio.maxCapacity ? (
            <span className="inline-flex items-center gap-1 text-xs text-base-content/60">
              <Users size={12} aria-hidden="true" />
              <span>Up to {studio.maxCapacity} creators</span>
            </span>
          ) : null}
        </div>

        <h3 className="mt-1.5 line-clamp-1 font-display text-xl font-normal leading-snug text-base-content transition-colors group-hover:text-primary sm:text-2xl">
          {studio.title}
        </h3>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-base-content/70">
          <MapPin
            size={14}
            aria-hidden="true"
            className="shrink-0 text-primary"
          />
          <span className="truncate">
            {studio.location}
            {studio.city ? `, ${studio.city}` : ""}
          </span>
        </div>

        <p className="mt-3.5 line-clamp-2 text-sm leading-relaxed text-base-content/75">
          {studio.overview}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-base-300/70 pt-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wider text-base-content/60">
              Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-base-content">
                $
                {Number(studio.hourlyRate || 0).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xs font-medium text-base-content/65">
                / hr
              </span>
            </div>
          </div>

          <Link
            href={`/studios/${studio._id}`}
            className="button-primary shrink-0 !min-h-10 !px-4 !py-2 text-xs font-semibold shadow-sm shadow-primary/20"
          >
            <span>View Details</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

