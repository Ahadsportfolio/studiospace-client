"use client";

import { Camera, CirclePlay } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Brand } from "@/components/brand";

const studioCategories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const quickLinks = [
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Host Your Space", href: "/add-studio" },
];

function XLogo() {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
    >
      <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.37L5.6 22H2.48l7.25-8.29L1.6 2h6.4l4.43 6.96L18.9 2Zm-1.1 18h1.73L7.07 3.9H5.2L17.8 20Z" />
    </svg>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email address to join the studio notes.");
      return;
    }

    toast.success("You’re on the list. Look out for your next studio note.");
    setEmail("");
  };

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_1.2fr] lg:px-10 lg:py-16">
        <div>
          <Brand inverse />
          <p className="mt-5 max-w-xs text-sm leading-7 text-neutral-content/80">
            A little more room for the work you want to make. Find the right
            creative space, meet the people behind it, and get to making.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <a
              aria-label="StudioSpace on X"
              className="btn btn-ghost btn-circle btn-sm"
              href="https://x.com"
              rel="noreferrer"
              target="_blank"
            >
              <XLogo />
            </a>
            <a
              aria-label="StudioSpace on Instagram"
              className="btn btn-ghost btn-circle btn-sm"
              href="https://instagram.com"
              rel="noreferrer"
              target="_blank"
            >
              <Camera aria-hidden="true" size={18} />
            </a>
            <a
              aria-label="StudioSpace on YouTube"
              className="btn btn-ghost btn-circle btn-sm"
              href="https://youtube.com"
              rel="noreferrer"
              target="_blank"
            >
              <CirclePlay aria-hidden="true" size={18} />
            </a>
            <a
              aria-label="StudioSpace on LinkedIn"
              className="btn btn-ghost btn-circle btn-sm font-semibold"
              href="https://linkedin.com"
              rel="noreferrer"
              target="_blank"
            >
              in
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-wide text-neutral-content">
            Good to know
          </h2>
          <ul className="mt-5 space-y-3">
            {quickLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  className="text-sm text-neutral-content/70 transition-colors hover:text-neutral-content"
                  href={href}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-wide text-neutral-content">
            Find your kind of space
          </h2>
          <ul className="mt-5 space-y-3">
            {studioCategories.map((category) => (
              <li key={category}>
                <Link
                  className="text-sm text-neutral-content/70 transition-colors hover:text-neutral-content"
                  href={`/studios?category=${encodeURIComponent(category)}`}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-wide text-neutral-content">
            Studio notes
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-content/70">
            New spaces, fresh ideas, and a little inspiration for your next
            project.
          </p>
          <form className="mt-4 flex gap-2" onSubmit={handleSubscribe}>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              autoComplete="email"
              className="input input-bordered min-w-0 flex-1 border-neutral-content/25 bg-neutral-content/10 text-sm text-neutral-content placeholder:text-neutral-content/50 focus:border-accent"
              id="newsletter-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              type="email"
              value={email}
            />
            <button className="button-primary !min-h-10 !px-5 text-sm font-semibold shrink-0" type="submit">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-neutral-content/15">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-neutral-content/75 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>© StudioSpace. Made for makers.</p>
          <div className="flex gap-5">
            <Link className="transition-colors hover:text-neutral-content" href="/terms">
              Terms
            </Link>
            <Link
              className="transition-colors hover:text-neutral-content"
              href="/privacy"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
