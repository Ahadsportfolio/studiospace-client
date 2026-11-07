"use client";

import Link from "next/link";
import {
  Camera,
  Clapperboard,
  Compass,
  Home,
  Mic2,
  Music2,
  Paintbrush,
  Search,
} from "lucide-react";
import { StudioIllustration404 } from "@/components/studio-illustration-404";

interface StudioNotFoundProps {
  studioId?: string;
}

const CATEGORY_LINKS = [
  { label: "Photo Studio", href: "/studios?category=Photo+Studio", icon: Camera },
  { label: "Film Stage", href: "/studios?category=Film+Stage", icon: Clapperboard },
  { label: "Podcast Lounge", href: "/studios?category=Podcast+Lounge", icon: Mic2 },
  { label: "Music Suite", href: "/studios?category=Music+Suite", icon: Music2 },
  { label: "Workshop", href: "/studios?category=Workshop", icon: Paintbrush },
];

export function StudioNotFound({ studioId }: StudioNotFoundProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
      {/* Status badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span>Error 404 • Studio Unavailable</span>
      </div>

      {/* SVG studio illustration (camera + spotlight) */}
      <div className="my-6">
        <StudioIllustration404 className="w-full max-w-md h-auto mx-auto drop-shadow-sm" />
      </div>

      <h1 className="font-display text-3xl font-normal tracking-tight text-base-content sm:text-4xl md:text-5xl">
        Creative Workspace Not Found
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-base-content/75 sm:text-lg">
        The studio space you are looking for{" "}
        {studioId ? (
          <code className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-xs text-primary">
            {studioId}
          </code>
        ) : (
          ""
        )}{" "}
        is no longer available, may have been retired by its host, or the link contains a typo.
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="button-primary inline-flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Home className="h-4 w-4" />
          <span>Return to Home</span>
        </Link>
        <Link
          href="/studios"
          className="button-secondary inline-flex items-center gap-2"
        >
          <Compass className="h-4 w-4" />
          <span>Explore Available Studios</span>
        </Link>
      </div>

      {/* Category quick links */}
      <div className="mt-12 rounded-2xl border border-base-300 bg-base-200/40 p-6 sm:p-7">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-base-content/60">
          <Search className="h-3.5 w-3.5 text-primary" />
          <span>Or browse other studios by category</span>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {CATEGORY_LINKS.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className="inline-flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3.5 py-2 text-xs font-medium text-base-content/80 shadow-xs transition-all hover:border-primary/50 hover:bg-base-200 hover:text-primary hover:-translate-y-0.5"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudioNotFound;
