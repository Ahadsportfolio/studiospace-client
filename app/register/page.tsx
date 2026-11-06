"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
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

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin, user, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    photoUrl: false,
    password: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Document title and redirect if already authenticated
  useEffect(() => {
    document.title = "Create Account | StudioSpace";
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  // Validation rules for Password: >=1 uppercase, >=1 lowercase, length >=6
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  // Additional field validations
  const isNameValid = name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhotoUrlValid =
    !photoUrl.trim() || /^https?:\/\/.+/i.test(photoUrl.trim());

  // Overall form validity — used to block submission
  const isFormValid =
    isNameValid && isEmailValid && isPasswordValid && isPhotoUrlValid;

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    // Explicitly block submit if invalid
    if (!isFormValid || isSubmitting) {
      if (!isPasswordValid) {
        toast.error(
          "Password must be at least 6 characters with uppercase and lowercase letters.",
        );
      } else if (!isNameValid) {
        toast.error("Please enter your name.");
      } else if (!isEmailValid) {
        toast.error("Please enter a valid email address.");
      } else if (!isPhotoUrlValid) {
        toast.error("Photo URL must start with http:// or https://");
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await register(
        name.trim(),
        email.trim(),
        password,
        photoUrl.trim() || undefined,
      );
      toast.success(
        "Account created successfully! Please sign in with your credentials.",
      );
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading || isSubmitting) return;
    setIsGoogleLoading(true);
    try {
      await googleLogin();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign in with Google. Please try again.",
      );
      setIsGoogleLoading(false);
    }
  };

  const showNameError = (touched.name || submitted) && !isNameValid;
  const showEmailError = (touched.email || submitted) && !isEmailValid;
  const showPhotoUrlError =
    (touched.photoUrl || submitted) && photoUrl.trim() && !isPhotoUrlValid;
  const showPasswordError =
    (touched.password || submitted) && !isPasswordValid;

  return (
    <main className="min-h-[calc(100vh-4.5rem)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-base-100">
      <div className="w-full max-w-lg">
        {/* Header / Intro */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/50 px-4 py-1.5 text-xs font-medium text-secondary mb-4">
            <Sparkles aria-hidden="true" className="text-accent" size={14} />
            <span>Join the StudioSpace Network</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-base-content tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-base-content/70">
            Book professional creative spaces or list your studio for creators.
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
              Or register with email
            </span>
          </div>

          {/* Registration Form */}
          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-base-content/80 mb-1.5"
                htmlFor="register-name"
              >
                Full Name <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                  <User aria-hidden="true" size={18} />
                </span>
                <input
                  aria-describedby={showNameError ? "name-error" : undefined}
                  aria-invalid={showNameError}
                  aria-required="true"
                  className={`input input-bordered w-full pl-10 rounded-xl bg-base-100 text-sm transition-colors ${
                    showNameError
                      ? "input-error border-error focus:border-error"
                      : "focus:border-primary"
                  }`}
                  disabled={isSubmitting}
                  id="register-name"
                  name="name"
                  onBlur={() => markTouched("name")}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  type="text"
                  value={name}
                />
              </div>
              {showNameError && (
                <p
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-error"
                  id="name-error"
                >
                  <AlertCircle aria-hidden="true" size={13} />
                  <span>Please enter your full name.</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-base-content/80 mb-1.5"
                htmlFor="register-email"
              >
                Email Address <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                  <Mail aria-hidden="true" size={18} />
                </span>
                <input
                  aria-describedby={showEmailError ? "email-error" : undefined}
                  aria-invalid={showEmailError}
                  aria-required="true"
                  autoComplete="email"
                  className={`input input-bordered w-full pl-10 rounded-xl bg-base-100 text-sm transition-colors ${
                    showEmailError
                      ? "input-error border-error focus:border-error"
                      : "focus:border-primary"
                  }`}
                  disabled={isSubmitting}
                  id="register-email"
                  name="email"
                  onBlur={() => markTouched("email")}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                />
              </div>
              {showEmailError && (
                <p
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-error"
                  id="email-error"
                >
                  <AlertCircle aria-hidden="true" size={13} />
                  <span>Please enter a valid email address.</span>
                </p>
              )}
            </div>

            {/* Photo URL (Optional) */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-base-content/80 mb-1.5"
                htmlFor="register-photo-url"
              >
                Photo URL{" "}
                <span className="text-[11px] font-normal normal-case text-base-content/50">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                  <ImageIcon aria-hidden="true" size={18} />
                </span>
                <input
                  aria-describedby={
                    showPhotoUrlError ? "photo-error" : undefined
                  }
                  aria-invalid={showPhotoUrlError ? true : undefined}
                  className={`input input-bordered w-full pl-10 rounded-xl bg-base-100 text-sm transition-colors ${
                    showPhotoUrlError
                      ? "input-error border-error focus:border-error"
                      : "focus:border-primary"
                  }`}
                  disabled={isSubmitting}
                  id="register-photo-url"
                  name="photoUrl"
                  onBlur={() => markTouched("photoUrl")}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.example.com/avatar.jpg"
                  type="url"
                  value={photoUrl}
                />
              </div>
              {showPhotoUrlError && (
                <p
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-error"
                  id="photo-error"
                >
                  <AlertCircle aria-hidden="true" size={13} />
                  <span>Photo URL must start with http:// or https://</span>
                </p>
              )}
            </div>

            {/* Password with inline validation criteria */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider text-base-content/80"
                  htmlFor="register-password"
                >
                  Password <span className="text-error">*</span>
                </label>
                <span className="text-[11px] text-base-content/50">
                  Min. 6 chars with upper & lower case
                </span>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                  <Lock aria-hidden="true" size={18} />
                </span>
                <input
                  aria-describedby="password-rules password-inline-error"
                  aria-invalid={showPasswordError}
                  aria-required="true"
                  autoComplete="new-password"
                  className={`input input-bordered w-full pl-10 pr-11 rounded-xl bg-base-100 text-sm transition-colors ${
                    showPasswordError
                      ? "input-error border-error focus:border-error"
                      : "focus:border-primary"
                  }`}
                  disabled={isSubmitting}
                  id="register-password"
                  name="password"
                  onBlur={() => markTouched("password")}
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

              {/* Real-time Inline Password Requirements */}
              <div
                className="mt-3 rounded-xl border border-base-300 bg-base-200/40 p-3 space-y-2 text-xs"
                id="password-rules"
              >
                <p className="font-medium text-base-content/80 text-[11px] uppercase tracking-wider">
                  Password Requirements:
                </p>
                <ul className="space-y-1.5">
                  <li
                    className={`flex items-center gap-2 transition-colors ${
                      hasMinLength
                        ? "text-success font-medium"
                        : password
                          ? "text-error"
                          : "text-base-content/60"
                    }`}
                  >
                    {hasMinLength ? (
                      <Check
                        aria-hidden="true"
                        className="text-success"
                        size={14}
                      />
                    ) : (
                      <X
                        aria-hidden="true"
                        className={password ? "text-error" : "text-base-content/40"}
                        size={14}
                      />
                    )}
                    <span>At least 6 characters</span>
                  </li>

                  <li
                    className={`flex items-center gap-2 transition-colors ${
                      hasUppercase
                        ? "text-success font-medium"
                        : password
                          ? "text-error"
                          : "text-base-content/60"
                    }`}
                  >
                    {hasUppercase ? (
                      <Check
                        aria-hidden="true"
                        className="text-success"
                        size={14}
                      />
                    ) : (
                      <X
                        aria-hidden="true"
                        className={password ? "text-error" : "text-base-content/40"}
                        size={14}
                      />
                    )}
                    <span>At least one uppercase letter (A-Z)</span>
                  </li>

                  <li
                    className={`flex items-center gap-2 transition-colors ${
                      hasLowercase
                        ? "text-success font-medium"
                        : password
                          ? "text-error"
                          : "text-base-content/60"
                    }`}
                  >
                    {hasLowercase ? (
                      <Check
                        aria-hidden="true"
                        className="text-success"
                        size={14}
                      />
                    ) : (
                      <X
                        aria-hidden="true"
                        className={password ? "text-error" : "text-base-content/40"}
                        size={14}
                      />
                    )}
                    <span>At least one lowercase letter (a-z)</span>
                  </li>
                </ul>
              </div>

              {/* Inline error feedback on submit/blur if invalid */}
              {showPasswordError && (
                <p
                  className="mt-2 flex items-center gap-1.5 text-xs text-error"
                  id="password-inline-error"
                >
                  <AlertCircle aria-hidden="true" size={13} />
                  <span>
                    Password must be at least 6 characters and include at least one uppercase and one lowercase letter.
                  </span>
                </p>
              )}
            </div>

            {/* Submit Button (blocked/disabled when invalid) */}
            <div className="pt-2">
              <button
                aria-disabled={!isFormValid || isSubmitting}
                className="button-primary w-full justify-center !rounded-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                disabled={!isFormValid || isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight aria-hidden="true" size={17} />
                  </>
                )}
              </button>
              {!isFormValid && (
                <p className="mt-2 text-center text-[11px] text-base-content/50">
                  Complete all required fields with valid password to enable registration.
                </p>
              )}
            </div>
          </form>

          {/* Footer Link to Login */}
          <div className="mt-6 border-t border-base-300 pt-5 text-center text-sm text-base-content/75">
            Already have an account?{" "}
            <Link
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* StudioSpace Guarantee / Context Footnote */}
        <p className="mt-6 text-center text-xs text-base-content/50">
          By signing up, you agree to StudioSpace host terms, creator guidelines, and space policies.
        </p>
      </div>
    </main>
  );
}
