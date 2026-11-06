"use client";

import Link from "next/link";
import {
  Camera,
  Compass,
  Film,
  Home,
  Mic,
  Music,
  Palette,
  Search,
} from "lucide-react";

interface StudioNotFoundProps {
  studioId?: string;
}

const CATEGORY_LINKS = [
  { label: "Photo Studio", href: "/studios?category=Photo+Studio", icon: Camera },
  { label: "Film Stage", href: "/studios?category=Film+Stage", icon: Film },
  { label: "Podcast Lounge", href: "/studios?category=Podcast+Lounge", icon: Mic },
  { label: "Music Suite", href: "/studios?category=Music+Suite", icon: Music },
  { label: "Workshop", href: "/studios?category=Workshop", icon: Palette },
];

export function StudioNotFound({ studioId }: StudioNotFoundProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
      {/* Visual illustration badge */}
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary shadow-inner">
        <Camera className="h-12 w-12 stroke-[1.5]" />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/80 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-base-content/70">
        <span>Error 404 • Studio Unavailable</span>
      </div>

      <h1 className="mt-4 font-display text-3xl font-normal tracking-tight text-base-content sm:text-4xl md:text-5xl">
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
          href="/studios"
          className="button-primary inline-flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Compass className="h-4 w-4" />
          <span>Explore Available Studios</span>
        </Link>
        <Link
          href="/"
          className="button-secondary inline-flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          <span>Return to Home</span>
        </Link>
      </div>

      {/* Category quick links */}
      <div className="mt-14 rounded-2xl border border-base-300 bg-base-200/40 p-6 sm:p-8">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-base-content/60">
          <Search className="h-3.5 w-3.5" />
          <span>Or browse by studio category</span>
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
