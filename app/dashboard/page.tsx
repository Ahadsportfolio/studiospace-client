import type { Metadata } from "next";
import { PrivateRoute } from "@/components/private-route";
import { DashboardContent } from "./dashboard-content";

export const metadata: Metadata = {
  title: "Host & Creator Dashboard — StudioSpace",
  description:
    "Manage your creative spaces, incoming booking requests, production calendar, and shoot schedules on StudioSpace.",
};

export default function DashboardPage() {
  return (
    <PrivateRoute
      message="Loading your dashboard..."
      submessage="Retrieving your studio bookings, host inventory, and production schedule."
    >
      <DashboardContent />
    </PrivateRoute>
  );
}
