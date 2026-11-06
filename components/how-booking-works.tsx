import {
  CalendarCheck2,
  Clapperboard,
  Clock3,
  Compass,
  type LucideIcon,
} from "lucide-react";

const bookingSteps: {
  title: string;
  description: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Discover Spaces",
    description:
      "Explore photo studios, film stages, podcast rooms, and more to find a space that fits your project.",
    Icon: Compass,
  },
  {
    title: "Select Shoot Hours",
    description:
      "Choose the date and session hours that work for your crew, schedule, and creative plans.",
    Icon: Clock3,
  },
  {
    title: "Book Instantly",
    description:
      "Send your booking online with your session details and studio costs together in one clear place.",
    Icon: CalendarCheck2,
  },
  {
    title: "Create & Produce",
    description:
      "Arrive ready to make something great, with your chosen creative workspace set for the day.",
    Icon: Clapperboard,
  },
];

export function HowBookingWorks() {
  return (
    <section
      aria-labelledby="how-booking-works-heading"
      className="w-full border-b border-base-300/60 bg-base-100 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-9 max-w-2xl sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            From idea to shoot day
          </p>
          <h2
            id="how-booking-works-heading"
            className="section-title mt-3 text-base-content"
          >
            How Booking Works
          </h2>
          <p className="body-copy mt-4">
            Find a space, plan your session, and get on with making your next
            project.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bookingSteps.map(({ title, description, Icon }, index) => (
            <li
              key={title}
              className="flex min-h-56 flex-col rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className="font-display text-3xl text-base-content/35">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl font-normal text-base-content">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
