import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid min-h-[min(760px,calc(100vh-4.5rem))] w-full max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-base-300 px-4 py-2 text-sm text-secondary">
            <span className="h-2 w-2 rounded-full bg-accent" />
            A home for creative work
          </p>
          <h1 className="page-title max-w-3xl">
            The right room changes everything.
          </h1>
          <p className="body-copy mt-7 max-w-xl">
            Find a Photo Studio, Film Stage, Podcast Lounge, Music Suite, or
            Workshop ready for whatever you want to make next.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link className="button-primary" href="/studios">
              Explore studios
              <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
            <Link className="button-secondary" href="/add-studio">
              Host your space
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative hidden min-h-[420px] overflow-hidden rounded-[2rem] bg-secondary lg:block"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_36%,rgba(226,184,95,0.82),transparent_28%),radial-gradient(ellipse_at_36%_67%,rgba(189,88,61,0.82),transparent_35%),linear-gradient(145deg,#293b36_8%,#49675e_62%,#8d9c7d)]" />
          <div className="absolute inset-x-7 bottom-7 rounded-2xl border border-white/25 bg-black/20 p-5 text-white backdrop-blur-md">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">
              Studio notes · 01
            </p>
            <p className="mt-2 font-display text-2xl">
              A space to see it differently.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
