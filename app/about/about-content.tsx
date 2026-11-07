"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  Camera,
  Clapperboard,
  Clock,
  Heart,
  Mic2,
  Music2,
  Paintbrush,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

const STATS = [
  {
    value: "250+",
    label: "Verified Creative Spaces",
    detail: "Across photo lofts, film soundstages, and audio suites",
  },
  {
    value: "12,000+",
    label: "Production Hours Booked",
    detail: "Guaranteed conflict-free with real-time schedule checks",
  },
  {
    value: "99.4%",
    label: "On-Time Session Rate",
    detail: "Seamless load-ins between verified creators and hosts",
  },
  {
    value: "$1.8M+",
    label: "Paid to Studio Hosts",
    detail: "Directly funding independent creative infrastructure",
  },
];

const VALUES = [
  {
    title: "Radical Transparency",
    description:
      "No hidden cleaning markups or undisclosed utility surcharges. Hourly rates and refundable security deposits are clearly itemized before booking confirmation.",
    Icon: Sparkles,
  },
  {
    title: "Conflict-Free Engineering",
    description:
      "We build robust scheduling software so you never face a double-booking. When a slot is confirmed, your crew’s production time is fully protected down to the minute.",
    Icon: ShieldCheck,
  },
  {
    title: "Equipment Stewardship",
    description:
      "High-end cinema glass, analog consoles, and infinity cyclorama walls demand respect. We foster accountability through verified profiles and structured security deposits.",
    Icon: Award,
  },
  {
    title: "Community & Creator First",
    description:
      "Whether you are an indie director shooting a festival short or an audio engineer tracking a debut album, our tools empower creative independence.",
    Icon: Heart,
  },
];

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  specialty: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Elena Vance",
    role: "Co-Founder & Head of Product",
    bio: "Former commercial director of photography with over a decade on production sets. Frustrated by opaque studio rentals, she set out to make space discovery transparent and accessible for indie crews.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    specialty: "Cinematography & Stage Design",
  },
  {
    name: "Marcus Chen",
    role: "Co-Founder & Chief Architect",
    bio: "Broadcast audio engineer turned full-stack system designer. Built Dante audio routing networks for major recording studios before architecting StudioSpace's real-time schedule conflict engine.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    specialty: "Distributed Systems & Studio Tech",
  },
  {
    name: "Maya Patel",
    role: "VP of Studio Operations",
    bio: "Previously managed a 12,000 sq ft industrial photo stage in Brooklyn. At StudioSpace, she leads host onboarding, facility standards, safety protocols, and host community education.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    specialty: "Facility Operations & Compliance",
  },
  {
    name: "David Okafor",
    role: "Head of Creator Community",
    bio: "Music producer, podcaster, and audio advocate. David connects daily with musicians, filmmakers, and content creators to expand our category inventory and champion independent creators.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    specialty: "Artist Relations & Partnerships",
  },
];

const DISCIPLINES: {
  category: "Photo Studio" | "Film Stage" | "Podcast Lounge" | "Music Suite" | "Workshop";
  label: string;
  description: string;
  Icon: LucideIcon;
  gearHighlights: string;
}[] = [
  {
    category: "Photo Studio",
    label: "Photo Studios",
    description:
      "Daylight spaces, seamless paper backdrops, and corner infinity cyclorama walls designed for fashion, product, and editorial photography.",
    Icon: Camera,
    gearHighlights: "Profoto strobe packs, C-stands, tethered stations, styling vanities",
  },
  {
    category: "Film Stage",
    label: "Film Stages",
    description:
      "Sound-dampened soundstages with high lighting grids, green screens, and vehicle load-in doors built for commercial, film, and music video shoots.",
    Icon: Clapperboard,
    gearHighlights: "100A+ three-phase power, motorized lighting grids, sound baffles",
  },
  {
    category: "Podcast Lounge",
    label: "Podcast Lounges",
    description:
      "Turnkey broadcast studios with multi-camera 4K switchers, dynamic microphones, and acoustic wall paneling for crystal-clear conversations.",
    Icon: Mic2,
    gearHighlights: "Shure SM7B microphones, Blackmagic ATEM switchers, RGB backlighting",
  },
  {
    category: "Music Suite",
    label: "Music Suites",
    description:
      "Acoustically floating control rooms, vocal isolation booths, and digital audio workstations ready for tracking, mixing, and mastering.",
    Icon: Music2,
    gearHighlights: "Analog preamps, nearfield studio monitors, Dante audio network",
  },
  {
    category: "Workshop",
    label: "Workshops",
    description:
      "Spacious maker ateliers with industrial workbenches, ceramic kilns, laser fabrication tools, and dust extraction for physical artisans.",
    Icon: Paintbrush,
    gearHighlights: "Heavy workbenches, fume extraction, ceramic wheels, assembly tables",
  },
];

export function AboutContent() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-base-300/60 bg-gradient-to-b from-base-200/60 via-base-100 to-base-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Our Mission &amp; Purpose</span>
            </div>
            <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-5xl lg:text-6xl">
              Democratizing Access to World-Class Creative Workspaces
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-base-content/75">
              We believe extraordinary art, film, and sound shouldn’t be gated by expensive
              commercial leases. StudioSpace connects creators with fully equipped production
              facilities by the hour—transparently, reliably, and conflict-free.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/studios" className="btn btn-primary rounded-full px-6">
                <span>Explore Studios</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/how-it-works" className="btn btn-outline rounded-full px-6">
                <span>See How It Works</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Impact Stats */}
      <section className="border-b border-base-300/60 bg-base-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs"
              >
                <div>
                  <p className="font-serif text-4xl sm:text-5xl font-medium text-primary">
                    {stat.value}
                  </p>
                  <h3 className="mt-3 font-serif text-lg font-medium text-base-content">
                    {stat.label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-base-content/70">
                    {stat.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story / Mission Deep-dive */}
      <section className="border-b border-base-300/60 bg-base-200/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Why We Built StudioSpace
              </p>
              <h2 className="section-title mt-2 text-base-content">
                Born on Real Film Sets and in Recording Lounges
              </h2>
              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-base-content/75">
                <p>
                  Every producer, photographer, and engineer knows the headache of production space
                  scouting. You need a corner cyclorama for an 8-hour shoot, but local commercial
                  facilities demand full-week retainers, manual contract negotiations, and weeks of
                  back-and-forth emails.
                </p>
                <p>
                  Meanwhile, across every creative district, world-class soundstages, photography
                  lofts, and vocal isolation booths sit idle between agency bookings. StudioSpace was
                  created to bridge that divide with a peer-to-peer marketplace that treats both
                  creators and studio owners with mutual respect.
                </p>
                <p>
                  We built our scheduling technology from scratch to eliminate double-booking
                  collisions, provide automated quote breakdowns, and guarantee security deposits.
                  Today, creators focus entirely on making great work, while studio owners turn quiet
                  calendar days into sustainable facility revenue.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs">
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Building2 className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-medium text-base-content">
                    For Studio Owners
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-base-content/70">
                    Monetize downtime, offset commercial property leases, and reinvest in new
                    lighting packages, acoustic upgrades, and creative gear.
                  </p>
                </div>
                <div className="mt-4 border-t border-base-200 pt-3">
                  <span className="text-xs font-semibold text-primary">
                    Guaranteed security deposits
                  </span>
                </div>
              </div>

              <div className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs">
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                    <Users className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-medium text-base-content">
                    For Production Crews
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-base-content/70">
                    Book commercial-grade production infrastructure by the hour without multi-month
                    leases or hidden broker commissions.
                  </p>
                </div>
                <div className="mt-4 border-t border-base-200 pt-3">
                  <span className="text-xs font-semibold text-secondary">
                    Zero double-booking guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="border-b border-base-300/60 bg-base-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Principles We Stand By
            </p>
            <h2 className="section-title mt-2 text-base-content">
              Our Core Operating Values
            </h2>
            <p className="mt-3 text-sm sm:text-base text-base-content/70">
              How we build our platform, support our hosts, and protect visiting production crews.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((val) => {
              const ValIcon = val.Icon;
              return (
                <div
                  key={val.title}
                  className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ValIcon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-serif text-xl font-medium text-base-content">
                      {val.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/70">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Five Production Categories Section */}
      <section className="border-b border-base-300/60 bg-base-200/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Specialized Infrastructure
            </p>
            <h2 className="section-title mt-2 text-base-content">
              The Five Disciplines We Power
            </h2>
            <p className="mt-3 text-base text-base-content/70">
              Each discipline on StudioSpace is curated with verified gear manifests and
              production capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {DISCIPLINES.map((d) => {
              const DIcon = d.Icon;
              return (
                <div
                  key={d.category}
                  className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs"
                >
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                      <DIcon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 font-serif text-lg font-medium text-base-content">
                      {d.label}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-base-content/70">
                      {d.description}
                    </p>
                  </div>
                  <div className="mt-5 border-t border-base-200 pt-3">
                    <p className="text-[11px] font-semibold text-primary">Included Gear:</p>
                    <p className="mt-0.5 text-[11px] text-base-content/75 leading-normal">
                      {d.gearHighlights}
                    </p>
                    <Link
                      href={`/studios?category=${encodeURIComponent(d.category)}`}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership / Team Section */}
      <section className="border-b border-base-300/60 bg-base-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Behind StudioSpace
            </p>
            <h2 className="section-title mt-2 text-base-content">
              Meet Our Creative Leadership
            </h2>
            <p className="mt-3 text-sm sm:text-base text-base-content/70">
              Our team pairs decades of hands-on production experience with modern engineering to
              empower creators everywhere.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-base-200">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-lg font-medium text-base-content">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary">{member.role}</p>
                    <p className="mt-3 text-xs leading-relaxed text-base-content/70">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="border-t border-base-200 px-5 py-3 bg-base-200/40">
                  <span className="text-[11px] font-semibold text-base-content/80">
                    Focus: {member.specialty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Safety & Host Standards */}
      <section className="border-b border-base-300/60 bg-base-200/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
              <BadgeCheck className="h-3.5 w-3.5" />
              <span>Production Safety &amp; Trust</span>
            </div>
            <h2 className="section-title mt-3 text-base-content">
              Built with Professional Standards
            </h2>
            <p className="mt-3 text-sm sm:text-base text-base-content/70">
              Clear rules, identity verification, and host support safeguard every production.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-medium text-base-content">
                  Security Deposit Protection
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-base-content/70">
                  Hosts set a dedicated security deposit to cover fragile equipment and facility
                  care. Deposits are refunded following checkout inspection.
                </p>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                  <BadgeCheck className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-medium text-base-content">
                  Verified Identity
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-base-content/70">
                  Every host and creator operates under a verified identity profile, ensuring
                  accountability and mutual trust on set.
                </p>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xs">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-base-content">
                  <Clock className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-medium text-base-content">
                  24/7 Creator Assistance
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-base-content/70">
                  Our operations team is available around the clock to help with shoot access,
                  production coordination, or emergency schedule changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-neutral text-neutral-content py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10 text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
            Join the StudioSpace Creator Network
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-neutral-content/75 leading-relaxed">
            Find the right workspace for your next production or list your creative space to welcome
            vetted directors, photographers, musicians, and makers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/studios"
              className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
              <span>Explore Studios</span>
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-neutral-content/30 bg-transparent px-7 py-3 text-sm font-semibold text-neutral-content transition-all hover:bg-neutral-content/10"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Host Your Studio</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
