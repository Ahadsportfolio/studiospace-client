import {
  BadgeCheck,
  Headset,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const creatorSupport: {
  title: string;
  description: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Liability Protection",
    description:
      "Review the liability protection details and booking terms before your session, so you know what applies to your reservation.",
    Icon: ShieldCheck,
  },
  {
    title: "Verified Profiles",
    description:
      "Connect through creator and host profiles with verified account details for more informed booking conversations.",
    Icon: BadgeCheck,
  },
  {
    title: "Equipment Safety",
    description:
      "Hosts can share equipment guidance and space-specific safety notes to help your crew prepare before arrival.",
    Icon: Wrench,
  },
  {
    title: "24/7 Host Support",
    description:
      "Get support around the clock for booking questions and help coordinating with your host.",
    Icon: Headset,
  },
];

export function HostGuarantee() {
  return (
    <section
      aria-labelledby="host-guarantee-heading"
      className="w-full border-b border-base-300/60 bg-base-200/50 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-9 max-w-2xl sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Confidence for every session
          </p>
          <h2
            id="host-guarantee-heading"
            className="section-title mt-3 text-base-content"
          >
            Host Guarantee &amp; Creator Support
          </h2>
          <p className="body-copy mt-4">
            Clear booking information and responsive support help creators and
            hosts work together with confidence.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {creatorSupport.map(({ title, description, Icon }) => (
            <li
              key={title}
              className="flex min-h-56 flex-col rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-normal text-base-content">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
