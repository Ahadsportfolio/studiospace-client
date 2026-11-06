"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, googleLogin, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Validate redirect parameter to ensure safe relative routing
  const rawRedirect = searchParams.get("redirect");
  const redirectTarget =
    rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/";

  // Document title and automatic redirect if already authenticated
  useEffect(() => {
    document.title = "Sign In | StudioSpace";
    if (!authLoading && user) {
      router.replace(redirectTarget);
    }
  }, [user, authLoading, router, redirectTarget]);

  // Handle escape key to dismiss the custom Forgot Password modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showForgotModal) {
        setShowForgotModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showForgotModal]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back! You have signed in.");
      router.push(redirectTarget);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Invalid email or password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading || isSubmitting) return;
    setIsGoogleLoading(true);
    try {
      await googleLogin(redirectTarget);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign in with Google. Please try again.",
      );
      setIsGoogleLoading(false);
    }
  };

  const handleOpenForgotPassword = () => {
    setShowForgotModal(true);
    toast.info("Password reset feature is coming soon!");
  };

  return (
    <main className="min-h-[calc(100vh-4.5rem)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-base-100">
      <div className="w-full max-w-lg">
        {/* Header / Intro */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/50 px-4 py-1.5 text-xs font-medium text-secondary mb-4">
            <Sparkles aria-hidden="true" className="text-accent" size={14} />
            <span>Welcome Back to StudioSpace</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-base-content tracking-tight">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-base-content/70">
            Access your booked workspaces, creative studios, and host dashboard.
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-xl">
          {/* Google Sign In Button */}
          <button
            className="btn btn-outline w-full rounded-full border-base-300 hover:bg-base-200 hover:border-base-content/30 gap-3 text-sm font-medium transition-all"
            disabled={isGoogleLoading || isSubmitting}
            onClick={handleGoogleSignIn}
            type="button"
          >
            {isGoogleLoading ? (
              <Loader2 className="animate-spin text-primary" size={18} />
            ) : (
              <GoogleIcon />
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 text-center text-xs text-base-content/50">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-base-300" />
            </div>
            <span className="relative bg-base-100 px-3 uppercase tracking-wider text-[11px] font-semibold">
              Or sign in with email
            </span>
          </div>

          {/* Login Form */}
          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            {/* Email Address */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-base-content/80 mb-1.5"
                htmlFor="login-email"
              >
                Email Address <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                  <Mail aria-hidden="true" size={18} />
                </span>
                <input
                  aria-required="true"
                  autoComplete="email"
                  className="input input-bordered w-full pl-10 rounded-xl bg-base-100 text-sm transition-colors focus:border-primary"
                  disabled={isSubmitting}
                  id="login-email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider text-base-content/80"
                  htmlFor="login-password"
                >
                  Password <span className="text-error">*</span>
                </label>
                <button
                  className="text-xs font-medium text-primary hover:underline transition-colors focus:outline-hidden"
                  onClick={handleOpenForgotPassword}
                  type="button"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                  <Lock aria-hidden="true" size={18} />
                </span>
                <input
                  aria-required="true"
                  autoComplete="current-password"
                  className="input input-bordered w-full pl-10 pr-11 rounded-xl bg-base-100 text-sm transition-colors focus:border-primary"
                  disabled={isSubmitting}
                  id="login-password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-base-content/50 hover:text-base-content transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" size={17} />
                  ) : (
                    <Eye aria-hidden="true" size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                aria-disabled={isSubmitting}
                className="button-primary w-full justify-center !rounded-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight aria-hidden="true" size={17} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Link to Register */}
          <div className="mt-6 border-t border-base-300 pt-5 text-center text-sm text-base-content/75">
            Don&apos;t have an account?{" "}
            <Link
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href={
                rawRedirect
                  ? `/register?redirect=${encodeURIComponent(rawRedirect)}`
                  : "/register"
              }
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Security / Quality Note */}
        <p className="mt-6 text-center text-xs text-base-content/50">
          Protected by StudioSpace secure authentication & encrypted session tokens.
        </p>
      </div>

      {/* Custom Forgot Password Modal (No alert()) */}
      {showForgotModal && (
        <div
          aria-labelledby="forgot-password-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowForgotModal(false)}
          role="dialog"
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <KeyRound aria-hidden="true" size={20} />
                </div>
                <div>
                  <h3
                    className="font-display text-xl text-base-content"
                    id="forgot-password-title"
                  >
                    Password Recovery
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-2.5 py-0.5 text-[11px] font-medium text-secondary mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Feature Coming Soon
                  </span>
                </div>
              </div>
              <button
                aria-label="Close dialog"
                className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
                onClick={() => setShowForgotModal(false)}
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-3 text-sm text-base-content/80">
              <p>
                Self-service password recovery is currently under development and will be available in an upcoming release.
              </p>
              <div className="flex items-start gap-2.5 rounded-xl border border-base-300 bg-base-200/50 p-3 text-xs text-base-content/70">
                <Info
                  aria-hidden="true"
                  className="text-secondary shrink-0 mt-0.5"
                  size={16}
                />
                <span>
                  If you need immediate assistance accessing your account, you can sign in directly using your linked Google account or contact StudioSpace creator support.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end">
              <button
                className="button-primary !min-h-10 !px-5 !py-2 text-sm !rounded-full"
                onClick={() => setShowForgotModal(false)}
                type="button"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function LoginSkeleton() {
  return (
    <main className="min-h-[calc(100vh-4.5rem)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-base-100">
      <div className="w-full max-w-lg space-y-8 animate-pulse">
        <div className="text-center space-y-3">
          <div className="h-6 w-48 bg-base-300 rounded-full mx-auto" />
          <div className="h-9 w-64 bg-base-300 rounded-xl mx-auto" />
          <div className="h-4 w-72 bg-base-300 rounded mx-auto" />
        </div>
        <div className="rounded-2xl border border-base-300 bg-base-100 p-8 shadow-xl space-y-5">
          <div className="h-11 w-full bg-base-300 rounded-full" />
          <div className="h-4 w-28 bg-base-300 rounded mx-auto" />
          <div className="h-11 w-full bg-base-300 rounded-xl" />
          <div className="h-11 w-full bg-base-300 rounded-xl" />
          <div className="h-12 w-full bg-base-300 rounded-full" />
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginFormContent />
    </Suspense>
  );
}

