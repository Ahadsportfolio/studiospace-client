import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  Paintbrush,
  type LucideIcon,
} from "lucide-react";
import type { StudioCategory } from "@/types/studio";

const categories: {
  label: string;
  category: StudioCategory;
  description: string;
  Icon: LucideIcon;
  iconStyle: string;
}[] = [
  {
    label: "Photo Studios",
    category: "Photo Studio",
    description: "Daylight spaces, portrait lofts, and cyclorama walls.",
    Icon: Camera,
    iconStyle: "bg-primary/10 text-primary",
  },
  {
    label: "Sound Stages",
    category: "Film Stage",
    description: "Production-ready stages built for bigger scenes.",
    Icon: Clapperboard,
    iconStyle: "bg-secondary/15 text-secondary",
  },
  {
    label: "Podcast Rooms",
    category: "Podcast Lounge",
    description: "Comfortable, equipped rooms for clear conversations.",
    Icon: Mic2,
    iconStyle: "bg-accent/20 text-base-content",
  },
  {
    label: "Music Suites",
    category: "Music Suite",
    description: "Recording and rehearsal rooms made for great sound.",
    Icon: Music2,
    iconStyle: "bg-info/15 text-info",
  },
  {
    label: "Art Workshops",
    category: "Workshop",
    description: "Hands-on workspaces for making something new.",
    Icon: Paintbrush,
    iconStyle: "bg-success/15 text-success",
  },
];

export function StudioCategories() {
  return (
    <section
      aria-labelledby="studio-categories-heading"
      className="w-full border-b border-base-300/60 bg-base-200/50 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-9 max-w-2xl sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Find your kind of space
          </p>
          <h2
            id="studio-categories-heading"
            className="section-title mt-3 text-base-content"
          >
            Browse by category
          </h2>
          <p className="body-copy mt-4">
            Start with the space that fits your next idea. Each category brings
            together studios ready for the way you create.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ label, category, description, Icon, iconStyle }) => (
            <Link
              key={category}
              href={`/studios?category=${encodeURIComponent(category)}`}
              className="group flex min-h-56 flex-col rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconStyle}`}
              >
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-normal text-base-content transition-colors group-hover:text-primary">
                {label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                {description}
              </p>
              <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-primary">
                Explore spaces
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
