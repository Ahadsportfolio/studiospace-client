import type { Metadata } from "next";
import { PrivateRoute } from "@/components/private-route";
import { MyBookingsContent } from "./my-bookings-content";

export const metadata: Metadata = {
  title: "My Studio Bookings — StudioSpace",
  description:
    "View and manage your reserved production workspaces, photo shoot sessions, and studio bookings on StudioSpace.",
};

export default function MyBookingsPage() {
  return (
    <PrivateRoute
      message="Retrieving your studio bookings..."
      submessage="Checking your reserved sessions and production schedule."
    >
      <MyBookingsContent />
    </PrivateRoute>
  );
}
