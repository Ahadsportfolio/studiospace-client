"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Lightbulb,
  Mail,
  MapPin,
  Maximize2,
  Mic,
  Palette,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Truck,
  UserCheck,
  Users,
  Video,
  Volume2,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Studio } from "@/types/studio";
import { BookingModal } from "./booking-modal";
import { BookingPanel } from "./booking-panel";
import { GalleryCarousel } from "./gallery-carousel";
import { StudioDetailSkeleton } from "./studio-detail-skeleton";
import { StudioNotFound } from "./studio-not-found";

interface StudioDetailContentProps {
  params: Promise<{ id: string }>;
}

// Icon mapper for studio amenities
function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes("cyc") || lower.includes("cyclorama") || lower.includes("ceiling")) {
    return Maximize2;
  }
  if (
    lower.includes("light") ||
    lower.includes("profoto") ||
    lower.includes("strobe") ||
    lower.includes("aputure") ||
    lower.includes("godox")
  ) {
    return Lightbulb;
  }
  if (
    lower.includes("sound") ||
    lower.includes("acoustic") ||
    lower.includes("quiet") ||
    lower.includes("isolation")
  ) {
    return Volume2;
  }
  if (
    lower.includes("mic") ||
    lower.includes("microphone") ||
    lower.includes("podcast") ||
    lower.includes("shure") ||
    lower.includes("neumann")
  ) {
    return Mic;
  }
  if (
    lower.includes("console") ||
    lower.includes("mixer") ||
    lower.includes("audio") ||
    lower.includes("pro tools") ||
    lower.includes("monitors")
  ) {
    return Sliders;
  }
  if (
    lower.includes("video") ||
    lower.includes("camera") ||
    lower.includes("4k") ||
    lower.includes("screen")
  ) {
    return Video;
  }
  if (lower.includes("power") || lower.includes("camlock") || lower.includes("400a") || lower.includes("electric")) {
    return Zap;
  }
  if (lower.includes("hvac") || lower.includes("ac") || lower.includes("air") || lower.includes("silent")) {
    return Wind;
  }
  if (lower.includes("wifi") || lower.includes("internet") || lower.includes("fiber")) {
    return Wifi;
  }
  if (
    lower.includes("vanity") ||
    lower.includes("makeup") ||
    lower.includes("hair") ||
    lower.includes("mirror")
  ) {
    return Sparkles;
  }
  if (
    lower.includes("elevator") ||
    lower.includes("freight") ||
    lower.includes("loading") ||
    lower.includes("drive-in")
  ) {
    return Truck;
  }
  if (
    lower.includes("kitchen") ||
    lower.includes("coffee") ||
    lower.includes("lounge") ||
    lower.includes("espresso")
  ) {
    return Coffee;
  }
  if (
    lower.includes("wheel") ||
    lower.includes("kiln") ||
    lower.includes("ceramic") ||
    lower.includes("bench") ||
    lower.includes("sink")
  ) {
    return Palette;
  }
  return CheckCircle2;
}

export function StudioDetailContent({ params }: StudioDetailContentProps) {
  const { id } = use(params);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingInitialHours, setBookingInitialHours] = useState(4);

  useEffect(() => {
    let ignore = false;

    async function loadStudioData() {
      // Validate 24 hex char MongoDB ObjectId
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      if (!isValidObjectId) {
        if (!ignore) {
          setIs404(true);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await apiFetch<Studio>(`/api/studios/${id}`);
        if (ignore) return;
        if (!data || !data._id) {
          setIs404(true);
        } else {
          setStudio(data);
          setError(null);
          setIs404(false);
        }
      } catch (err: unknown) {
        if (ignore) return;
        const apiErr = err as { status?: number; message?: string };
        if (apiErr?.status === 404 || apiErr?.status === 400) {
          setIs404(true);
        } else {
          setError(
            apiErr?.message ||
              "Could not retrieve studio details. Please check your connection."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadStudioData();

    return () => {
      ignore = true;
    };
  }, [id, refreshIndex]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setIs404(false);
    setRefreshIndex((idx) => idx + 1);
  };

  if (loading) {
    return <StudioDetailSkeleton />;
  }

  if (is404) {
    return <StudioNotFound studioId={id} />;
  }

  if (error || !studio) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-error/30 bg-error/10 p-8 text-error">
          <h2 className="text-xl font-bold">Failed to load studio details</h2>
          <p className="mt-2 text-sm text-base-content/80">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="button-primary !min-h-10 text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
            <Link
              href="/studios"
              className="button-secondary !min-h-10 text-xs font-semibold"
            >
              Back to Studios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const galleryImages =
    Array.isArray(studio.gallery) && studio.gallery.length > 0
      ? studio.gallery
      : studio.image
      ? [studio.image]
      : [];

  const reviewsList = Array.isArray(studio.reviews) ? studio.reviews : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 text-xs text-base-content/65"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-base-content/40" />
        <Link href="/studios" className="hover:text-primary transition-colors">
          Explore Studios
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-base-content/40" />
        <Link
          href={`/studios?category=${encodeURIComponent(studio.category)}`}
          className="hover:text-primary transition-colors font-medium text-base-content/85"
        >
          {studio.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-base-content/40" />
        <span className="truncate max-w-[220px] sm:max-w-xs text-base-content/90 font-medium">
          {studio.title}
        </span>
      </nav>

      {/* 2. Top Header: Title, Category Badge, Rating, Location */}
      <header className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {studio.category}
            </span>

            {/* Rating badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-200 px-3 py-1 text-xs font-semibold text-base-content">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{Number(studio.rating || 0).toFixed(1)}</span>
              <span className="text-base-content/60 font-normal">
                ({studio.reviewCount || reviewsList.length} reviews)
              </span>
            </span>

            {/* Capacity badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-200/80 px-3 py-1 text-xs font-medium text-base-content/80">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>Up to {studio.maxCapacity} creators</span>
            </span>
          </div>

          {/* Studio ID indicator */}
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-base-content/50 font-mono">
            <span>ID:</span>
            <span>{studio._id.slice(-6)}</span>
          </div>
        </div>

        {/* Studio Title */}
        <h1 className="font-display text-3xl font-normal leading-tight tracking-tight text-base-content sm:text-4xl lg:text-5xl">
          {studio.title}
        </h1>

        {/* Location line */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/75">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="font-medium text-base-content">
            {studio.location}
          </span>
          {studio.city && (
            <span className="text-base-content/70">· {studio.city}</span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-success font-medium ml-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Verified Location
          </span>
        </div>
      </header>

      {/* 3. Main Grid: Left Column (Gallery + Specs + Overview + Amenities + Host + Reviews) / Right Column (Sticky Booking Panel) */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left Content (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Gallery Carousel (Swiper) */}
          <section aria-label="Studio Photo Gallery">
            <GalleryCarousel
              title={studio.title}
              category={studio.category}
              images={galleryImages}
            />
          </section>

          {/* Quick Specifications Bar */}
          <section
            aria-label="Studio key specifications"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-base-300 bg-base-200/50 p-5"
          >
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
                Hourly Rate
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-base-content">
                  ${studio.hourlyRate}
                </span>
                <span className="text-xs text-base-content/60">/ hr</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
                Security Deposit
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-base-content">
                  ${studio.securityDeposit}
                </span>
                <span className="text-xs text-base-content/60">refundable</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
                Max Capacity
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-base-content">
                  {studio.maxCapacity}
                </span>
                <span className="text-xs text-base-content/60">creators</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
                Studio Category
              </span>
              <div className="mt-1 text-sm font-bold text-primary truncate">
                {studio.category}
              </div>
            </div>
          </section>

          {/* Overview Section */}
          <section
            aria-labelledby="overview-heading"
            className="border-t border-base-300/80 pt-8"
          >
            <h2
              id="overview-heading"
              className="font-display text-2xl font-normal text-base-content sm:text-3xl"
            >
              Workspace Overview
            </h2>
            <p className="mt-4 text-base leading-relaxed text-base-content/80 whitespace-pre-line sm:text-lg">
              {studio.overview}
            </p>

            {/* Production Highlights Box */}
            <div className="mt-6 rounded-2xl border border-base-300/80 bg-base-100 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Production Standards & Access
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-base-content/80">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>24/7 keycode or host check-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  <span>Verified sound isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Heavy-duty production power</span>
                </div>
              </div>
            </div>
          </section>

          {/* Amenities & Equipment List */}
          <section
            aria-labelledby="amenities-heading"
            className="border-t border-base-300/80 pt-8"
          >
            <div className="flex items-center justify-between">
              <h2
                id="amenities-heading"
                className="font-display text-2xl font-normal text-base-content sm:text-3xl"
              >
                Included Equipment & Amenities
              </h2>
              <span className="text-xs text-base-content/60 font-medium">
                {studio.amenities?.length || 0} features
              </span>
            </div>

            {studio.amenities && studio.amenities.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {studio.amenities.map((amenity) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 transition-all duration-200 hover:border-primary/40 hover:bg-base-200/50 hover:shadow-xs"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-base-content">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-base-content/60">
                Standard production utilities included. Contact host for specialty gear lists.
              </p>
            )}
          </section>

          {/* Host Card */}
          <section
            aria-labelledby="host-heading"
            className="border-t border-base-300/80 pt-8"
          >
            <h2
              id="host-heading"
              className="font-display text-2xl font-normal text-base-content sm:text-3xl"
            >
              Meet Your Host
            </h2>

            <div className="mt-6 rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Host avatar initials */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-content font-display text-2xl font-semibold shadow-inner">
                    {studio.ownerName ? studio.ownerName[0].toUpperCase() : "H"}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-xl font-normal text-base-content">
                        {studio.ownerName || "StudioSpace Host"}
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                        <UserCheck className="h-3 w-3" /> Verified Host
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-base-content/65">
                      Host contact: {studio.ownerEmail}
                    </p>
                    <p className="mt-2 text-xs text-base-content/75">
                      StudioSpace certified partner · 100% response rate · Responds within 1 hour
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toast.info(
                      `Direct host messaging for ${studio.ownerName || "the host"} is available after placing a booking request.`
                    );
                  }}
                  className="button-secondary !min-h-10 !px-4 !py-2 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Contact Host</span>
                </button>
              </div>

              <div className="mt-6 border-t border-base-200 pt-5 text-sm leading-relaxed text-base-content/75">
                Our team assists with freight elevator operation, lighting package staging, and quick power distribution so your production schedule runs on time from the moment you roll in.
              </div>
            </div>
          </section>

          {/* Reviews List */}
          <section
            aria-labelledby="reviews-heading"
            className="border-t border-base-300/80 pt-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2
                  id="reviews-heading"
                  className="font-display text-2xl font-normal text-base-content sm:text-3xl"
                >
                  Creator Reviews
                </h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-base-content/75">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-base-content">
                    {Number(studio.rating || 0).toFixed(1)} out of 5
                  </span>
                  <span>·</span>
                  <span>
                    {reviewsList.length}{" "}
                    {reviewsList.length === 1 ? "verified review" : "verified reviews"}
                  </span>
                </div>
              </div>
            </div>

            {reviewsList.length > 0 ? (
              <div className="mt-6 space-y-4">
                {reviewsList.map((review, index) => {
                  const initials = review.name
                    ? review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "CR";

                  const formattedDate = review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Recent creator review";

                  return (
                    <article
                      key={`${review.name}-${index}`}
                      className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs transition-colors hover:border-base-content/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          {review.photo ? (
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-base-300 bg-base-200">
                              <Image
                                src={review.photo}
                                alt={review.name}
                                fill
                                sizes="44px"
                                className="object-cover"
                                unoptimized={
                                  !review.photo.includes("images.unsplash.com") &&
                                  !review.photo.includes("i.ibb.co")
                                }
                              />
                            </div>
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/20 font-bold text-accent text-xs">
                              {initials}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-base-content text-sm">
                                {review.name}
                              </h4>
                              <span className="rounded-full bg-success/15 px-2 py-0.2 text-[10px] font-semibold text-success">
                                Verified
                              </span>
                            </div>
                            <span className="text-xs text-base-content/60">
                              {formattedDate}
                            </span>
                          </div>
                        </div>

                        {/* Star rating */}
                        <div className="flex items-center gap-1 text-xs font-semibold text-base-content">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>{Number(review.rating || 5).toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-base-content/80">
                        {review.comment}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-base-300 bg-base-200/40 p-8 text-center">
                <Star className="mx-auto h-8 w-8 text-base-content/40" />
                <h3 className="mt-3 font-semibold text-base-content">
                  No reviews yet for this workspace
                </h3>
                <p className="mt-1 text-xs text-base-content/65 max-w-sm mx-auto">
                  Be the first creator to book and produce in this studio. Leave an honest review for future creators!
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right Content (4 cols): Sticky "Book Workspace Now" Panel */}
        <div className="lg:col-span-4">
          <BookingPanel
            studio={studio}
            onBookClick={(hours) => {
              if (typeof hours === "number") {
                setBookingInitialHours(hours);
              }
              setIsBookingModalOpen(true);
            }}
          />
          <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            studio={studio}
            initialHours={bookingInitialHours}
          />
        </div>
      </div>
    </div>
  );
}
