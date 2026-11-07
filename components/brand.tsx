import { Aperture } from "lucide-react";
import Link from "next/link";

type BrandProps = {
  inverse?: boolean;
};

export function Brand({ inverse = false }: BrandProps) {
  return (
    <Link
      aria-label="StudioSpace home"
      className={`inline-flex items-center gap-2.5 font-semibold tracking-tight ${
        inverse ? "text-neutral-content" : "text-base-content"
      }`}
      href="/"
    >
      <Aperture aria-hidden="true" className="text-primary" size={25} />
      <span>StudioSpace</span>
    </Link>
  );
}
