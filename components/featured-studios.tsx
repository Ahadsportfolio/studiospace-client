"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  RefreshCw,
  Sparkles,
  Star,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Studio, StudiosApiResponse } from "@/types/studio";

async function fetchFeaturedStudios(): Promise<Studio[]> {
  const response = await apiFetch<StudiosApiResponse>(
    "/api/studios?limit=6&sort=rating",
  );

  if (!response || !Array.isArray(response.data)) {
    throw new Error("The featured studios response was invalid.");
  }

  return response.data.slice(0, 6);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Featured studios could not be loaded.";
}

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchFeaturedStudios()
      .then((items) => {
        if (active) {
          setStudios(items);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getErrorMessage(requestError));
          setStudios([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const retryFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      setStudios(await fetchFeaturedStudios());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setStudios([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="featured-studios-heading"
      className="w-full border-b border-base-300/60 bg-base-100 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 border-b border-base-300/70 pb-10 md:flex-row md:items-end md:justify-between sm:pb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles size={13} aria-hidden="true" />
              <span>Top-Rated Workspaces</span>
            </div>
            <h2
              id="featured-studios-heading"
              className="mt-3.5 font-display text-3xl font-normal tracking-tight text-base-content sm:text-4xl lg:text-5xl"
            >
              Featured Studios
            </h2>
            <p className="mt-3 text-base leading-relaxed text-base-content/75 sm:text-lg">
              Find a well-equipped space for your next shoot, session, or
              production.
            </p>
          </div>

          <Link
            href="/studios"
            className="button-secondary group shrink-0 !min-h-11 !px-5 text-sm font-semibold"
          >
            <span>Explore All Studios</span>
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div
          aria-busy={loading}
          aria-label={loading ? "Loading featured studios" : undefined}
          className="mt-10 sm:mt-12"
        >
          {loading ? (
            <div
              aria-hidden="true"
              className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
                >
                  <div className="relative aspect-[16/10] w-full animate-pulse bg-base-200">
                    <div className="absolute left-3.5 top-3.5 h-6 w-24 rounded-full bg-base-300/80" />
                    <div className="absolute right-3.5 top-3.5 h-6 w-16 rounded-full bg-base-300/80" />
                  </div>
                  <div className="flex flex-1 flex-col space-y-4 p-6">
                    <div className="space-y-2">
                      <div className="h-4 w-24 animate-pulse rounded-full bg-base-200" />
                      <div className="h-6 w-5/6 animate-pulse rounded-lg bg-base-200" />
                    </div>
                    <div className="h-4 w-1/2 animate-pulse rounded bg-base-200" />
                    <div className="space-y-2 pt-2">
                      <div className="h-3 w-full animate-pulse rounded bg-base-200" />
                      <div className="h-3 w-4/5 animate-pulse rounded bg-base-200" />
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-base-300/60 pt-5">
                      <div className="space-y-2">
                        <div className="h-3 w-16 animate-pulse rounded bg-base-200" />
                        <div className="h-6 w-20 animate-pulse rounded bg-base-200" />
                      </div>
                      <div className="h-10 w-32 animate-pulse rounded-full bg-base-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div
              role="alert"
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-200/50 p-10 text-center"
            >
              <p className="font-semibold text-base-content">
                Featured studios could not be loaded.
              </p>
              <p className="mt-2 max-w-lg text-sm text-base-content/70">
                {error}
              </p>
              <button
                type="button"
                onClick={() => void retryFetch()}
                className="button-secondary mt-5 !min-h-10 !px-4 text-xs font-semibold"
              >
                <RefreshCw size={14} aria-hidden="true" />
                <span>Try again</span>
              </button>
            </div>
          ) : studios.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-200/50 p-10 text-center">
              <p className="font-semibold text-base-content">
                No featured studios are available right now.
              </p>
              <p className="mt-2 text-sm text-base-content/70">
                Browse all studios to find a space for your next project.
              </p>
              <Link
                href="/studios"
                className="button-secondary mt-5 !min-h-10 !px-4 text-xs font-semibold"
              >
                Explore Studios
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {studios.map((studio) => (
                <article
                  key={studio._id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-300">
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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
                      <span>{studio.rating.toFixed(1)}</span>
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {studio.category}
                    </span>
                    <h3 className="mt-1 line-clamp-1 font-display text-xl font-normal leading-snug text-base-content transition-colors group-hover:text-primary sm:text-2xl">
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
                            {studio.hourlyRate.toLocaleString("en-US", {
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
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
