import type { Metadata } from "next";
import { PrivateRoute } from "@/components/private-route";
import { EditStudioContent } from "./edit-studio-content";

interface EditStudioPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Update Studio Listing — StudioSpace",
  description:
    "Edit studio workspace details, amenities, pricing, capacity, and visual media on StudioSpace.",
};

export default function EditStudioPage({ params }: EditStudioPageProps) {
  return (
    <PrivateRoute
      message="Loading studio workspace editor..."
      submessage="Verifying your host credentials and studio listing specifications."
    >
      <EditStudioContent params={params} />
    </PrivateRoute>
  );
}
