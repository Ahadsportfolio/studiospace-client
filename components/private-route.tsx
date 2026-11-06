"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { BrandedSpinner } from "@/components/branded-spinner";
import { useAuth } from "@/providers/auth-provider";

export type PrivateRouteProps = {
  children: ReactNode;
  message?: string;
  submessage?: string;
};

function PrivateRouteGuard({
  children,
  message = "Verifying studio access...",
  submessage = "Checking your StudioSpace credentials and session status.",
}: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // CRITICAL: NEVER redirect while auth state is loading (ensures reload safety)
    if (loading) {
      return;
    }

    // Only redirect if auth resolution has completed and no authenticated user exists
    if (!user) {
      const queryString = searchParams?.toString();
      const currentPath =
        queryString && queryString.length > 0
          ? `${pathname || "/"}?${queryString}`
          : pathname || "/";
      const redirectTarget = encodeURIComponent(currentPath);
      router.replace(`/login?redirect=${redirectTarget}`);
    }
  }, [user, loading, router, pathname, searchParams]);

  // While auth is resolving, or while unauthenticated (awaiting redirect), show branded spinner
  if (loading || !user) {
    return <BrandedSpinner message={message} submessage={submessage} />;
  }

  // Authenticated user: render protected page content
  return <>{children}</>;
}

export function PrivateRoute(props: PrivateRouteProps) {
  return (
    <Suspense
      fallback={
        <BrandedSpinner
          message={props.message}
          submessage={props.submessage}
        />
      }
    >
      <PrivateRouteGuard {...props} />
    </Suspense>
  );
}

export default PrivateRoute;
