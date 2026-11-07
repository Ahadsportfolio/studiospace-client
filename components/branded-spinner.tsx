import { Aperture, Sparkles } from "lucide-react";

export type BrandedSpinnerProps = {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * Branded global studio spinner with rotating shutter aperture,
 * ambient lens glow, and authentic studio status indicators.
 */
export function BrandedSpinner({
  message = "Loading StudioSpace...",
  submessage = "Setting the stage for your creative production.",
  fullScreen = false,
  size = "md",
  className = "",
}: BrandedSpinnerProps) {
  const sizeConfig = {
    sm: {
      outerRing: "h-12 w-12 border-2",
      innerAperture: "h-8 w-8",
      icon: "h-4 w-4",
      title: "text-base",
      sub: "text-xs",
      gap: "mt-3",
      padding: "p-3",
    },
    md: {
      outerRing: "h-20 w-20 border-2",
      innerAperture: "h-12 w-12",
      icon: "h-6 w-6",
      title: "text-xl",
      sub: "text-xs",
      gap: "mt-6",
      padding: "p-6",
    },
    lg: {
      outerRing: "h-28 w-28 border-3",
      innerAperture: "h-16 w-16",
      icon: "h-8 w-8",
      title: "text-2xl",
      sub: "text-sm",
      gap: "mt-8",
      padding: "p-8",
    },
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center text-center ${sizeConfig.padding} ${
        fullScreen ? "fixed inset-0 z-50 min-h-screen bg-base-100/90 backdrop-blur-md" : "min-h-[50vh]"
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Ambient brand studio glow */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse"
        />

        {/* Outer counter-rotating dashed precision ring */}
        <div
          aria-hidden="true"
          className={`absolute rounded-full border border-dashed border-base-300 animate-spin [animation-duration:8s] ${
            size === "sm" ? "h-14 w-14" : size === "lg" ? "h-32 w-32" : "h-24 w-24"
          }`}
        />

        {/* Primary rotating aperture ring */}
        <div
          aria-hidden="true"
          className={`relative rounded-full border-base-300 border-t-primary border-r-primary/70 animate-spin [animation-duration:1.2s] ${sizeConfig.outerRing}`}
        />

        {/* Center aperture camera brand mark */}
        <div
          aria-hidden="true"
          className={`absolute flex items-center justify-center rounded-full bg-base-100 shadow-md shadow-base-content/10 border border-base-300/60 ${sizeConfig.innerAperture}`}
        >
          <Aperture className={`text-primary animate-pulse ${sizeConfig.icon}`} />
        </div>

        {/* Subtle camera tally spark */}
        <div
          aria-hidden="true"
          className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </div>
      </div>

      {(message || submessage) && (
        <div className={`max-w-sm space-y-1.5 px-4 ${sizeConfig.gap}`}>
          {message && (
            <h3 className={`font-serif font-medium tracking-tight text-base-content ${sizeConfig.title}`}>
              {message}
            </h3>
          )}
          {submessage && (
            <p className={`text-base-content/70 leading-relaxed ${sizeConfig.sub}`}>
              {submessage}
            </p>
          )}
        </div>
      )}

      <span className="sr-only">Loading StudioSpace content...</span>
    </div>
  );
}

/**
 * Fullscreen branded global spinner overlay for major transitions or initial app boot.
 */
export function GlobalSpinner(props: Omit<BrandedSpinnerProps, "fullScreen">) {
  return <BrandedSpinner fullScreen {...props} />;
}

export default BrandedSpinner;
