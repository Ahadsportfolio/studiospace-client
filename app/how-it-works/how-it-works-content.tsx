"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clapperboard,
  Compass,
  FileText,
  Headset,
  HelpCircle,
  KeyRound,
  Mic2,
  Music2,
  Paintbrush,
  PlusCircle,
  ShieldCheck,
  Sliders,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type WorkflowRole = "creator" | "host";

interface StepItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  Icon: LucideIcon;
  highlights: string[];
}

const CREATOR_STEPS: StepItem[] = [
  {
    number: "01",
    title: "Discover & Filter Spaces",
    subtitle: "Find the exact environment your production demands",
    description:
      "Search curated studios across 5 specialized disciplines: Photo Studio, Film Stage, Podcast Lounge, Music Suite, and Workshop. Filter by hourly rate, crew capacity, cyclorama dimensions, sound isolation ratings, or heavy power distribution.",
    Icon: Compass,
    highlights: [
      "Filter by 5 exact creative production categories",
      "Sort by hourly rate, crew capacity, or newest spaces",
      "Inspect verified studio specs, floor plans, and amenities",
    ],
  },
  {
    number: "02",
    title: "Inspect Specs & Live Availability",
    subtitle: "Check gear inventories and conflict-free calendars",
    description:
      "Review high-resolution galleries, gear rosters (C-stands, strobe packs, Dante audio networks, cinema lighting), and house rules. Our server checks confirmed bookings in real time to prevent any double-booking collisions.",
    Icon: Sliders,
    highlights: [
      "Zero double-bookings with automated conflict checks",
      "Transparent host hourly rates and security deposits",
      "Detailed gear manifests and loading bay specifications",
    ],
  },
  {
    number: "03",
    title: "Book Instantly with Transparent Pricing",
    subtitle: "Reserve shoot hours without surprise fees",
    description:
      "Select your shoot date, start time, and end time. The system calculates exact pricing upfront: hourly rate × hours plus a refundable security deposit. Attach your production crew notes, project scope, and submit your request.",
    Icon: CalendarCheck2,
    highlights: [
      "Live price breakdown calculated automatically",
      "Custom production notes sent directly to the host",
      "Track status instantly from your My Bookings dashboard",
    ],
  },
  {
    number: "04",
    title: "Load In, Create & Wrap",
    subtitle: "Arrive prepared and produce your best work",
    description:
      "Upon host confirmation, access clear load-in instructions, door codes, and studio manager contacts. Produce your project, wrap on schedule, leave the workspace clean, and share an authentic review for the creative community.",
    Icon: Clapperboard,
    highlights: [
      "Seamless load-in with pre-shared access details",
      "On-site host support or contactless digital keypad entry",
      "Verified reviews to help fellow creators choose studios",
    ],
  },
];

const HOST_STEPS: StepItem[] = [
  {
    number: "01",
    title: "List Your Studio in Minutes",
    subtitle: "Turn studio downtime into predictable revenue",
    description:
      "Showcase your creative workspace to thousands of vetted directors, photographers, and audio engineers. Upload high-res photos via ImgBB, set your hourly rate and security deposit, establish maximum capacity, and tag all included studio amenities.",
    Icon: PlusCircle,
    highlights: [
      "Fast listing creation with instant photo uploads",
      "Customizable hourly rates and refundable security deposits",
      "Highlight specialized gear, cyc walls, and acoustic treatment",
    ],
  },
  {
    number: "02",
    title: "Review Incoming Booking Requests",
    subtitle: "Maintain complete control over your studio calendar",
    description:
      "Manage all reservations from your dedicated Host Dashboard. Review creator profiles, intended production scopes, crew sizes, and requested shoot hours. Confirm bookings or decline requests with helpful context notes.",
    Icon: FileText,
    highlights: [
      "Review crew sizes, production details, and shoot hours",
      "Confirm or decline requests with 1-click status actions",
      "Automated collision warnings prevent conflicting slots",
    ],
  },
  {
    number: "03",
    title: "Coordinate Load-in & Studio Access",
    subtitle: "Set clear guidelines for smooth production days",
    description:
      "Share arrival protocols, parking passes, freight elevator access, and quiet hours. Whether you greet crews personally or provide digital lockbox entry, our system keeps communication clear and professional.",
    Icon: KeyRound,
    highlights: [
      "Clear load-in and parking instructions for visiting crews",
      "Designated on-site host or contactless self-check-in",
      "Explicit house rules safeguard equipment and fixtures",
    ],
  },
  {
    number: "04",
    title: "Collect Earnings & Build Reputation",
    subtitle: "Grow your creative facility with peace of mind",
    description:
      "Security deposits protect your cameras, lighting grids, and sound isolation booths. Build recurring relationships with production teams, gain top-tier ratings, and turn your creative workspace into a thriving business hub.",
    Icon: Wallet,
    highlights: [
      "Transparent deposit terms protect your space and gear",
      "Gain five-star reviews from verified production crews",
      "Reinvest rental earnings into fresh studio equipment",
    ],
  },
];

const PLATFORM_PILLARS = [
  {
    title: "Zero Double-Bookings",
    description:
      "Our backend validation engine enforces strict time overlap checks on confirmed reservations. Two crews can never be booked for the same space at the same time.",
    Icon: ShieldCheck,
    badge: "100% Guaranteed",
  },
  {
    title: "Verified Creative Profiles",
    description:
      "Hosts and creators authenticate securely. Account verification ensures accountability, transparent identities, and mutual respect for expensive studio equipment.",
    Icon: BadgeCheck,
    badge: "Secure Access",
  },
  {
    title: "Transparent Pricing",
    description:
      "Never worry about surprise cleanup surcharges or undisclosed fees. Every quote clearly separates the host's hourly rate from the refundable security deposit.",
    Icon: Sparkles,
    badge: "Upfront Rates",
  },
  {
    title: "24/7 Production Support",
    description:
      "Our support team understands creative workflows. Whether you need assistance adjusting a shoot schedule or resolving an access question, help is always ready.",
    Icon: Headset,
    badge: "Always On",
  },
];

const CATEGORIES = [
  {
    category: "Photo Studio",
    tagline: "Daylight Lofts & Cycloramas",
    description:
      "Engineered for editorial lookbooks, commercial catalog shoots, and portrait sessions with high ceilings, continuous daylight, and 2-wall corner cycs.",
    Icon: Camera,
    features: ["Corner cyc walls", "Profoto / Broncolor power", "Hair & makeup vanity"],
  },
  {
    category: "Film Stage",
    tagline: "Soundstages & Green Screens",
    description:
      "Built for indie features, commercials, and music videos with sound-dampened acoustics, 100A+ electrical distribution, and vehicle drive-in access.",
    Icon: Clapperboard,
    features: ["Heavy power distro (100A+)", "Drive-in load-in bay", "Acoustic baffling"],
  },
  {
    category: "Podcast Lounge",
    tagline: "Multi-Mic Broadcast Rooms",
    description:
      "Acoustically isolated conversation lounges equipped with Shure SM7B microphones, broadcast audio interfaces, 4K camera switchers, and cozy lighting.",
    Icon: Mic2,
    features: ["Shure broadcast mics", "Multi-camera 4K switcher", "Treated sound isolation"],
  },
  {
    category: "Music Suite",
    tagline: "Control Rooms & Vocal Booths",
    description:
      "Professional audio recording spaces with floating floors, Dante audio networks, vintage preamplifiers, vocal booths, and nearfield studio monitors.",
    Icon: Music2,
    features: ["Treated control rooms", "Vocal isolation booths", "Dante audio routing"],
  },
  {
    category: "Workshop",
    tagline: "Maker Labs & Creative Ateliers",
    description:
      "Hands-on fabrication rooms equipped with heavy-duty workbenches, ceramic kilns, laser cutting tools, dust extraction systems, and wet sinks.",
    Icon: Paintbrush,
    features: ["Industrial workbenches", "Fume & dust extraction", "Maker tooling & sinks"],
  },
];

const FAQS = [
  {
    question: "How does StudioSpace prevent double-booking collisions?",
    answer:
      "When a creator requests or a host confirms a booking, our server validates the exact timeframe against all existing confirmed reservations for that studio. If the start and end times intersect with an already-confirmed slot, the system rejects the operation with an explicit conflict message. Back-to-back sessions (e.g. 10:00–14:00 and 14:00–18:00) are fully supported.",
  },
  {
    question: "What is the purpose of the security deposit?",
    answer:
      "The security deposit is set by the studio owner to protect specialized equipment (such as cyclorama walls, strobe lighting packs, microphones, and delicate acoustic panels). It is held securely and returned after your shoot once checkout inspection confirms the space and gear are in good order.",
  },
  {
    question: "Can I bring my own camera, lighting, and audio equipment?",
    answer:
      "Yes, absolutely. Creators are encouraged to bring their own camera packages, lighting kits, grip equipment, and props. We recommend checking the studio's listed electrical power capacity and loading bay specifications on the studio details page before booking.",
  },
  {
    question: "How do cancellations work for creators?",
    answer:
      "You can cancel any booking in 'Pending' status directly from your My Bookings page at any time with a single click. For 'Confirmed' bookings, please reach out to your host as early as possible so they can accommodate schedule adjustments or free the calendar slot.",
  },
  {
    question: "How do studio owners receive and approve booking requests?",
    answer:
      "Hosts receive incoming booking requests directly in their Host Dashboard. You can review the creator's name, requested hours, total calculated payment, and custom production notes. With one click, hosts can confirm the reservation or decline if the project doesn't fit the space.",
  },
  {
    question: "Can I be both a creator and a studio host on StudioSpace?",
    answer:
      "Yes! Every StudioSpace account can book creative workspaces across any category and also list spaces they manage. You can switch between browsing studios and managing your own listings seamlessly using the navigation menu.",
  },
];

export function HowItWorksContent() {
  const [activeRole, setActiveRole] = useState<WorkflowRole>("creator");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const currentSteps = activeRole === "creator" ? CREATOR_STEPS : HOST_STEPS;

  return (
    <div className="w-full">
      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-base-300/60 bg-gradient-to-b from-base-200/60 via-base-100 to-base-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Production Made Frictionless</span>
            </div>
            <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-5xl lg:text-6xl">
              How StudioSpace Works
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-base-content/75">
              A peer-to-peer production marketplace designed for filmmakers, photographers,
              podcasters, musicians, and makers. Discover how creators reserve vetted studios
              by the hour and how hosts turn unused space into reliable income.
            </p>

            {/* Role Switcher Tabs */}
            <div className="mt-10 inline-flex max-w-full flex-wrap justify-center sm:flex-nowrap rounded-2xl sm:rounded-full border border-base-300 bg-base-200/80 p-1.5 shadow-xs gap-1 sm:gap-0">
              <button
                type="button"
                onClick={() => setActiveRole("creator")}
                className={`flex items-center gap-2 rounded-xl sm:rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  activeRole === "creator"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/80 hover:text-base-content"
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>For Creators &amp; Crews</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("host")}
                className={`flex items-center gap-2 rounded-xl sm:rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  activeRole === "host"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/80 hover:text-base-content"
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                <span>For Studio Hosts</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Step-by-Step Flow */}
      <section className="border-b border-base-300/60 bg-base-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {activeRole === "creator" ? "Creator Journey" : "Host Roadmap"}
              </p>
              <h2 className="section-title mt-2 text-base-content">
                {activeRole === "creator"
                  ? "Four Simple Steps from Idea to Shoot Day"
                  : "Four Steps to Monetize Your Creative Facility"}
              </h2>
            </div>
            <p className="max-w-md text-sm text-base-content/70">
              {activeRole === "creator"
                ? "Every studio booking is guaranteed conflict-free with transparent rates and dedicated creator support."
                : "List in minutes, review incoming production requests, and enjoy guaranteed security deposit protection."}
            </p>
          </div>

          {/* Equal height & width cards grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {currentSteps.map((step) => {
              const StepIcon = step.Icon;
              return (
                <div
                  key={step.number}
                  className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <StepIcon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="font-serif text-3xl font-light text-base-content/50">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-xl font-medium text-base-content">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      {step.subtitle}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/80">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-base-200 pt-4">
                    <ul className="space-y-2">
                      {step.highlights.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-base-content/75"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick CTA inside step section */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
            {activeRole === "creator" ? (
              <>
                <Link href="/studios" className="btn btn-primary rounded-full px-6">
                  <span>Explore Available Studios</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveRole("host")}
                  className="btn btn-outline rounded-full px-6"
                >
                  <span>Learn About Hosting</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/add-studio" className="btn btn-primary rounded-full px-6">
                  <span>List Your Creative Space</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveRole("creator")}
                  className="btn btn-outline rounded-full px-6"
                >
                  <span>See Creator Experience</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Categories Showcase (5 exact strings) */}
      <section className="border-b border-base-300/60 bg-base-200/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Spaces Built for Every Discipline
            </p>
            <h2 className="section-title mt-2 text-base-content">
              Five Studio Categories, Tailored for Real Work
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-base-content/70">
              We specialize in production-ready creative environments with technical capabilities
              that general office rentals simply cannot provide.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.Icon;
              return (
                <div
                  key={cat.category}
                  className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
                >
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <CatIcon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-serif text-lg font-medium text-base-content">
                      {cat.category}
                    </h3>
                    <p className="text-xs font-semibold text-primary">{cat.tagline}</p>
                    <p className="mt-3 text-xs leading-relaxed text-base-content/70">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-base-200 pt-4">
                    <div className="space-y-1.5">
                      {cat.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-[11px] text-base-content/80 font-medium"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/studios?category=${encodeURIComponent(cat.category)}`}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Browse {cat.category}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Guarantees Section */}
      <section className="border-b border-base-300/60 bg-base-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Built on Trust &amp; Reliability
            </p>
            <h2 className="section-title mt-2 text-base-content">
              The StudioSpace Standard
            </h2>
            <p className="mt-3 text-base text-base-content/70">
              Production schedules can’t afford surprises. Here is how our technology and
              community standards protect every creative session.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_PILLARS.map((pillar) => {
              const PillarIcon = pillar.Icon;
              return (
                <div
                  key={pillar.title}
                  className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                        <PillarIcon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-base-200 px-2.5 py-0.5 text-[11px] font-semibold text-base-content/80">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-xl font-medium text-base-content">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/70">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="border-b border-base-300/60 bg-base-200/50 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="section-title mt-3 text-base-content">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm sm:text-base text-base-content/70">
              Clear answers regarding bookings, security deposits, cancellations, and host policies.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-lg font-medium text-base-content">
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-200 text-base-content/70 transition-transform ${
                        isOpen ? "rotate-180 bg-primary/10 text-primary" : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-base-200/80 px-5 pb-6 pt-3 sm:px-6">
                      <p className="text-sm leading-relaxed text-base-content/75">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-neutral text-neutral-content py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10 text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
            Ready to Begin Your Next Creative Production?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-neutral-content/75 leading-relaxed">
            Discover hundreds of photo lofts, soundstages, podcast setups, and recording suites
            ready for reservation, or list your own creative space today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/studios"
              className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Studios</span>
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-neutral-content/30 bg-transparent px-7 py-3 text-sm font-semibold text-neutral-content transition-all hover:bg-neutral-content/10"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Host Your Space</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
