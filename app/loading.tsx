import { BrandedSpinner } from "@/components/branded-spinner";

export default function RootLoading() {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center px-4">
      <BrandedSpinner
        message="Loading StudioSpace..."
        submessage="Preparing creative production workspaces and shoot schedules."
      />
    </div>
  );
}

