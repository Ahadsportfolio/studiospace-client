"use client";

import { PrivateRoute } from "@/components/private-route";
import { AddStudioForm } from "./add-studio-form";

export default function AddStudioPage() {
  return (
    <PrivateRoute
      message="Accessing host studio workspace..."
      submessage="Verifying your StudioSpace host session credentials."
    >
      <AddStudioForm />
    </PrivateRoute>
  );
}
