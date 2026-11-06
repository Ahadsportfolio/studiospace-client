import type { Metadata } from "next";
import { PrivateRoute } from "@/components/private-route";
import { MyListingsContent } from "./my-listings-content";

export const metadata: Metadata = {
  title: "My Studio Listings — StudioSpace",
  description:
    "Manage your creative production studios, film stages, podcast lounges, and workshops on StudioSpace.",
};

export default function MyListingsPage() {
  return (
    <PrivateRoute
      message="Loading your studio listings..."
      submessage="Retrieving your creative spaces and host inventory."
    >
      <MyListingsContent />
    </PrivateRoute>
  );
}
