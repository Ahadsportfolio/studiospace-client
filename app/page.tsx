import { HomeHero } from "@/components/home-hero";
import { FeaturedStudios } from "@/components/featured-studios";
import { StudioCategories } from "@/components/studio-categories";
import { HowBookingWorks } from "@/components/how-booking-works";
import { HostGuarantee } from "@/components/host-guarantee";

export default function Home() {
  return (
    <main className="w-full">
      <HomeHero />
      <FeaturedStudios />
      <StudioCategories />
      <HowBookingWorks />
      <HostGuarantee />
    </main>
  );
}
