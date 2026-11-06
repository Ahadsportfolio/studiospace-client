import { Aperture } from "lucide-react";

type BrandedSpinnerProps = {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
};

export function BrandedSpinner({
  message = "Verifying studio access...",
  submessage = "Checking your StudioSpace credentials and session status.",
  fullScreen = false,
}: BrandedSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-6 text-center ${
        fullScreen ? "min-h-screen" : "min-h-[55vh]"
      }`}
    >
      <div className="relative flex items-center justify-center">
        {/* Ambient brand glow */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-full bg-primary/15 blur-xl animate-pulse"
        />

        {/* Outer rotating aperture ring */}
        <div
          aria-hidden="true"
          className="relative h-20 w-20 rounded-full border-2 border-base-300 border-t-primary border-r-primary/70 animate-spin"
        />

        {/* Center aperture brand icon */}
        <div
          aria-hidden="true"
          className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-base-100 shadow-md shadow-base-content/5"
        >
          <Aperture className="h-6 w-6 text-primary animate-pulse" />
        </div>
      </div>

      <div className="mt-6 max-w-sm space-y-1.5 px-4">
        <h3 className="font-serif text-xl font-medium tracking-tight text-base-content">
          {message}
        </h3>
        {submessage && (
          <p className="text-xs text-base-content/70">
            {submessage}
          </p>
        )}
      </div>

      <span className="sr-only">Loading StudioSpace content...</span>
    </div>
  );
}

export default BrandedSpinner;

