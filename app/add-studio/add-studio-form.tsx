"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  DollarSign,
  Upload,
  Link as LinkIcon,
  Sparkles,
  MapPin,
  Check,
  X,
  Plus,
  Loader2,
  AlertCircle,
  Eye,
  ShieldCheck,
  UserCheck,
  Mail,
  Camera,
  Layers,
  ArrowLeft,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { uploadImageToImgbb } from "@/lib/imgbb";
import { useAuth } from "@/providers/auth-provider";
import { STUDIO_CATEGORIES, StudioCategory } from "@/types/studio";

// Curated studio-specific amenities for quick selection
const POPULAR_AMENITIES = [
  "Cyclorama Wall",
  "Soundproof Vocal Booth",
  "Professional Lighting Grid",
  "Continuous Video Lighting",
  "Strobe Flash Lighting Kit",
  "C-Stands & Grip Gear",
  "Green Screen Backdrop",
  "Multi-Mic Podcast Setup",
  "Audio Interface & Monitors",
  "Hair & Makeup Vanity",
  "Blackout Curtains",
  "High-Speed Wi-Fi (1Gbps)",
  "Air Conditioning & Heating",
  "Private Dressing Room",
  "Client Lounge Area",
  "Kitchenette & Espresso Bar",
  "Free On-Site Parking",
  "Freight Elevator Access",
];

const CATEGORY_DESCRIPTIONS: Record<StudioCategory, string> = {
  "Photo Studio": "White cyc walls, daylight lofts, backdrop mounts & editorial sets",
  "Film Stage": "Sound stages, chroma green screens, cinema lighting & motion capture",
  "Podcast Lounge": "Acoustically isolated multi-mic video broadcast & talk show suites",
  "Music Suite": "Control rooms, tracking booths, analog preamps & mastering monitors",
  Workshop: "Creative fabrication labs, prop making, set building & art workshops",
};

interface FormErrors {
  title?: string;
  category?: string;
  hourlyRate?: string;
  securityDeposit?: string;
  maxCapacity?: string;
  location?: string;
  image?: string;
  amenities?: string;
  overview?: string;
}

export function AddStudioForm() {
  const router = useRouter();
  const { user } = useAuth();

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<StudioCategory>("Photo Studio");
  const [hourlyRate, setHourlyRate] = useState<string>("85");
  const [securityDeposit, setSecurityDeposit] = useState<string>("100");
  const [maxCapacity, setMaxCapacity] = useState<string>("10");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [overview, setOverview] = useState("");

  // Image Upload / URL State
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Amenities State
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "High-Speed Wi-Fi (1Gbps)",
    "Air Conditioning & Heating",
  ]);
  const [customAmenityInput, setCustomAmenityInput] = useState("");

  // Submission & Validation States
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle amenity selection
  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
    );
    if (errors.amenities) {
      setErrors((prev) => ({ ...prev, amenities: undefined }));
    }
  };

  // Add custom amenity tag
  const handleAddCustomAmenity = () => {
    const trimmed = customAmenityInput.trim();
    if (!trimmed) return;

    if (
      selectedAmenities.some(
        (a) => a.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      toast.info(`"${trimmed}" is already in your amenities list.`);
      setCustomAmenityInput("");
      return;
    }

    setSelectedAmenities((prev) => [...prev, trimmed]);
    setCustomAmenityInput("");
    if (errors.amenities) {
      setErrors((prev) => ({ ...prev, amenities: undefined }));
    }
  };

  // Handle file upload to ImgBB
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadError(null);
    setIsUploadingImage(true);

    try {
      const uploadedUrl = await uploadImageToImgbb(file);
      setImageUrl(uploadedUrl);
      toast.success("Image successfully uploaded to ImgBB!");
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: undefined }));
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to upload image. Please try again or use a direct URL.";
      setImageUploadError(message);
      toast.error(message);
    } finally {
      setIsUploadingImage(false);
      // Reset input value so the same file can be chosen again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Studio title is required.";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long.";
    }

    if (!STUDIO_CATEGORIES.includes(category)) {
      newErrors.category = "Please select a valid canonical category.";
    }

    const rateNum = Number(hourlyRate);
    if (!hourlyRate || isNaN(rateNum) || rateNum <= 0) {
      newErrors.hourlyRate = "Hourly rate must be a positive number greater than $0.";
    }

    const depositNum = Number(securityDeposit);
    if (
      securityDeposit !== "" &&
      (isNaN(depositNum) || depositNum < 0)
    ) {
      newErrors.securityDeposit = "Security deposit must be $0 or greater.";
    }

    const capNum = Number(maxCapacity);
    if (!maxCapacity || isNaN(capNum) || capNum < 1 || !Number.isInteger(capNum)) {
      newErrors.maxCapacity = "Max capacity must be a positive whole number (at least 1).";
    }

    if (!location.trim()) {
      newErrors.location = "Studio address/location is required.";
    }

    if (!imageUrl.trim()) {
      newErrors.image = "Please upload an image to ImgBB or provide a valid image URL.";
    } else if (!/^https?:\/\/.+/i.test(imageUrl.trim())) {
      newErrors.image = "Image must be a valid URL starting with http:// or https://";
    }

    if (selectedAmenities.length === 0) {
      newErrors.amenities = "Please select or add at least one amenity.";
    }

    if (!overview.trim()) {
      newErrors.overview = "Detailed overview is required.";
    } else if (overview.trim().length < 20) {
      newErrors.overview = "Overview should be at least 20 characters to inform creators.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        category,
        hourlyRate: Number(hourlyRate),
        securityDeposit: securityDeposit ? Number(securityDeposit) : 0,
        maxCapacity: Math.floor(Number(maxCapacity)),
        location: location.trim(),
        city: city.trim() || undefined,
        image: imageUrl.trim(),
        gallery: [imageUrl.trim()],
        amenities: selectedAmenities,
        overview: overview.trim(),
      };

      await apiFetch("api/studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast.success("Studio listing published successfully! Creators can now discover and book your space.");
      router.push("/my-listings");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to publish studio listing. Please check your inputs and try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back navigation & page title */}
      <div className="mb-6">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-base-content/70 hover:text-primary transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to My Listings
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Host Workspace</span>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
              List a New Studio
            </h1>
            <p className="mt-1.5 text-sm text-base-content/70 sm:text-base">
              Publish your creative stage, sound room, cyc wall, or workshop to thousands of verified creators.
            </p>
          </div>
        </div>
      </div>

      {/* Host Identity Card (Read-only Name & Email from authenticated user) */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-base-300/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/80">
              Verified Host Identity (Read-Only)
            </span>
          </div>
          <span className="badge badge-sm badge-success gap-1 text-[11px] font-medium">
            <UserCheck className="h-3 w-3" /> Session Verified
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Read-only Name */}
          <div>
            <label className="block text-xs font-medium text-base-content/70 mb-1">
              Host Name
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                disabled
                value={user?.name || "Studio Host"}
                className="input input-bordered w-full bg-base-100/70 text-base-content font-medium opacity-90 cursor-not-allowed pl-9"
              />
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
            </div>
          </div>

          {/* Read-only Email */}
          <div>
            <label className="block text-xs font-medium text-base-content/70 mb-1">
              Host Email
            </label>
            <div className="relative">
              <input
                type="email"
                readOnly
                disabled
                value={user?.email || ""}
                className="input input-bordered w-full bg-base-100/70 text-base-content font-medium opacity-90 cursor-not-allowed pl-9"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
            </div>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-base-content/60">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Listing ownership and host booking inquiries are bound to your verified account credentials.
        </p>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Title, Category & Location */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-base-200">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-medium text-base-content">
              Studio Essentials
            </h2>
          </div>

          <div className="space-y-5">
            {/* Studio Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-base-content mb-1.5"
              >
                Studio Title <span className="text-error">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="e.g. Apex Daylight Stage & Infinity Cyclorama"
                className={`input input-bordered w-full ${
                  errors.title ? "input-error" : ""
                }`}
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Category Select (Exact 5 categories) */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-base-content mb-1.5"
              >
                Category <span className="text-error">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as StudioCategory);
                  if (errors.category) {
                    setErrors((prev) => ({ ...prev, category: undefined }));
                  }
                }}
                className={`select select-bordered w-full font-medium ${
                  errors.category ? "select-error" : ""
                }`}
              >
                {STUDIO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-base-content/65">
                {CATEGORY_DESCRIPTIONS[category]}
              </p>
              {errors.category && (
                <p className="mt-1 text-xs text-error flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.category}
                </p>
              )}
            </div>

            {/* Location & City */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-base-content mb-1.5"
                >
                  Address / Studio Location <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location) {
                        setErrors((prev) => ({ ...prev, location: undefined }));
                      }
                    }}
                    placeholder="e.g. 580 Industrial Pkwy, Suite 400"
                    className={`input input-bordered w-full pl-9 ${
                      errors.location ? "input-error" : ""
                    }`}
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
                </div>
                {errors.location && (
                  <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.location}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-base-content mb-1.5"
                >
                  City / Region
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Los Angeles, CA"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Capacity */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-base-200">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-medium text-base-content">
              Rates & Creator Capacity
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Hourly Rate */}
            <div>
              <label
                htmlFor="hourlyRate"
                className="block text-sm font-medium text-base-content mb-1.5"
              >
                Hourly Rate ($) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-base-content/60">
                  $
                </span>
                <input
                  id="hourlyRate"
                  type="number"
                  min="1"
                  step="1"
                  value={hourlyRate}
                  onChange={(e) => {
                    setHourlyRate(e.target.value);
                    if (errors.hourlyRate) {
                      setErrors((prev) => ({ ...prev, hourlyRate: undefined }));
                    }
                  }}
                  placeholder="85"
                  className={`input input-bordered w-full pl-8 ${
                    errors.hourlyRate ? "input-error" : ""
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-base-content/50">
                  / hour
                </span>
              </div>
              {errors.hourlyRate && (
                <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.hourlyRate}
                </p>
              )}
            </div>

            {/* Security Deposit */}
            <div>
              <label
                htmlFor="securityDeposit"
                className="block text-sm font-medium text-base-content mb-1.5"
              >
                Security Deposit ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-base-content/60">
                  $
                </span>
                <input
                  id="securityDeposit"
                  type="number"
                  min="0"
                  step="1"
                  value={securityDeposit}
                  onChange={(e) => {
                    setSecurityDeposit(e.target.value);
                    if (errors.securityDeposit) {
                      setErrors((prev) => ({ ...prev, securityDeposit: undefined }));
                    }
                  }}
                  placeholder="0"
                  className={`input input-bordered w-full pl-8 ${
                    errors.securityDeposit ? "input-error" : ""
                  }`}
                />
              </div>
              <p className="mt-1 text-[11px] text-base-content/60">
                Refundable upon equipment inspection
              </p>
              {errors.securityDeposit && (
                <p className="mt-1 text-xs text-error flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.securityDeposit}
                </p>
              )}
            </div>

            {/* Max Capacity */}
            <div>
              <label
                htmlFor="maxCapacity"
                className="block text-sm font-medium text-base-content mb-1.5"
              >
                Max Capacity <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  id="maxCapacity"
                  type="number"
                  min="1"
                  step="1"
                  value={maxCapacity}
                  onChange={(e) => {
                    setMaxCapacity(e.target.value);
                    if (errors.maxCapacity) {
                      setErrors((prev) => ({ ...prev, maxCapacity: undefined }));
                    }
                  }}
                  placeholder="10"
                  className={`input input-bordered w-full pr-14 ${
                    errors.maxCapacity ? "input-error" : ""
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-base-content/50">
                  guests
                </span>
              </div>
              <p className="mt-1 text-[11px] text-base-content/60">
                Crew & creative talent limit
              </p>
              {errors.maxCapacity && (
                <p className="mt-1 text-xs text-error flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.maxCapacity}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Studio Image (ImgBB File Upload OR URL) */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-base-200">
            <div className="flex items-center gap-2.5">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-medium text-base-content">
                Cover Image Showcase <span className="text-error">*</span>
              </h2>
            </div>

            {/* Mode Toggle (Upload vs URL) */}
            <div className="inline-flex rounded-lg bg-base-200 p-1">
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  imageMode === "upload"
                    ? "bg-base-100 text-primary shadow-xs"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                <Upload className="h-3.5 w-3.5" /> Upload File (ImgBB)
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  imageMode === "url"
                    ? "bg-base-100 text-primary shadow-xs"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                <LinkIcon className="h-3.5 w-3.5" /> Direct URL
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* File Upload Mode (Direct to ImgBB) */}
            {imageMode === "upload" && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                  id="imgbb-file-input"
                  disabled={isUploadingImage}
                />
                <label
                  htmlFor="imgbb-file-input"
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                    isUploadingImage
                      ? "border-primary/60 bg-primary/5 cursor-wait"
                      : "border-base-300 hover:border-primary/60 hover:bg-base-200/50"
                  }`}
                >
                  {isUploadingImage ? (
                    <div className="flex flex-col items-center py-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-sm font-medium text-base-content">
                        Uploading high-resolution studio image to ImgBB...
                      </p>
                      <p className="text-xs text-base-content/60 mt-1">
                        Optimizing and acquiring secure CDN link
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-base-content">
                        Click to select image or drag and drop
                      </p>
                      <p className="text-xs text-base-content/60 mt-1">
                        PNG, JPG, or WEBP up to 16MB • Direct upload via ImgBB API
                      </p>
                    </div>
                  )}
                </label>
                {imageUploadError && (
                  <p className="mt-2 text-xs text-error flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {imageUploadError}
                  </p>
                )}
              </div>
            )}

            {/* Direct URL Mode */}
            {imageMode === "url" && (
              <div>
                <label
                  htmlFor="imageUrlInput"
                  className="block text-xs font-medium text-base-content/70 mb-1"
                >
                  Direct Image URL
                </label>
                <div className="relative">
                  <input
                    id="imageUrlInput"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (errors.image) {
                        setErrors((prev) => ({ ...prev, image: undefined }));
                      }
                    }}
                    placeholder="https://images.unsplash.com/photo-... or https://i.ibb.co/..."
                    className={`input input-bordered w-full pl-9 ${
                      errors.image ? "input-error" : ""
                    }`}
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
                </div>
                <p className="mt-1 text-[11px] text-base-content/60">
                  Tip: Use high-res Unsplash, Postimages, or ImgBB studio imagery.
                </p>
              </div>
            )}

            {/* Live Image Preview Card */}
            {imageUrl && (
              <div className="relative mt-4 overflow-hidden rounded-xl border border-base-300 bg-base-200/50">
                <div className="relative aspect-[16/9] w-full max-h-72 overflow-hidden bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Studio preview"
                    className="h-full w-full object-cover"
                    onError={() => {
                      toast.error("Could not load image from the provided URL.");
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    <Eye className="h-3 w-3" /> Live Preview
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setImageUploadError(null);
                    }}
                    className="absolute right-3 top-3 btn btn-circle btn-xs btn-error text-white shadow-sm"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-medium truncate text-white/90">
                      {title || "Untitled Studio"}
                    </p>
                    <p className="text-[11px] text-white/70 truncate">
                      {imageUrl}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errors.image && (
              <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.image}
              </p>
            )}
          </div>
        </div>

        {/* Section 4: Amenities Tag & Checkbox Input */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-base-200">
            <div className="flex items-center gap-2.5">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-medium text-base-content">
                Studio Amenities & Equipment <span className="text-error">*</span>
              </h2>
            </div>
            <span className="badge badge-sm badge-outline">
              {selectedAmenities.length} selected
            </span>
          </div>

          {/* Quick Select Checkboxes */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-base-content/70 mb-2.5 uppercase tracking-wider">
                Select Standard Gear & Features:
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {POPULAR_AMENITIES.map((item) => {
                  const isChecked = selectedAmenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity(item)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${
                        isChecked
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                          : "border-base-300 bg-base-100 text-base-content/80 hover:border-base-content/30 hover:bg-base-200/50"
                      }`}
                    >
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          isChecked
                            ? "border-primary bg-primary text-primary-content"
                            : "border-base-content/30 bg-base-100"
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amenity Tag Input */}
            <div className="pt-3 border-t border-base-200">
              <label
                htmlFor="customAmenity"
                className="block text-xs font-medium text-base-content/70 mb-1.5 uppercase tracking-wider"
              >
                Add Custom Amenity or Gear Tag:
              </label>
              <div className="flex gap-2">
                <input
                  id="customAmenity"
                  type="text"
                  value={customAmenityInput}
                  onChange={(e) => setCustomAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomAmenity();
                    }
                  }}
                  placeholder="e.g. Smoke Machine, Teleprompter, Drum Kit..."
                  className="input input-bordered input-sm flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="btn btn-primary btn-sm rounded-lg gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Tag
                </button>
              </div>
            </div>

            {/* Selected Amenity Pills */}
            <div>
              <p className="text-xs font-medium text-base-content/70 mb-2">
                Active Listing Amenities:
              </p>
              {selectedAmenities.length === 0 ? (
                <p className="text-xs italic text-base-content/50">
                  No amenities selected yet. Pick from above or type a custom tag.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedAmenities.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-base-200 px-3 py-1 text-xs font-medium text-base-content border border-base-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleAmenity(tag)}
                        className="text-base-content/50 hover:text-error transition-colors"
                        title={`Remove ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {errors.amenities && (
              <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.amenities}
              </p>
            )}
          </div>
        </div>

        {/* Section 5: Studio Overview */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-base-200">
            <h2 className="font-serif text-lg font-medium text-base-content">
              Detailed Overview & Studio Specs <span className="text-error">*</span>
            </h2>
            <span className="text-xs text-base-content/60">
              {overview.length} characters
            </span>
          </div>

          <div>
            <textarea
              rows={6}
              value={overview}
              onChange={(e) => {
                setOverview(e.target.value);
                if (errors.overview) {
                  setErrors((prev) => ({ ...prev, overview: undefined }));
                }
              }}
              placeholder="Describe your studio layout, lighting grid, ceiling heights, acoustics, included gear, load-in accessibility, and house rules for production crews..."
              className={`textarea textarea-bordered w-full leading-relaxed ${
                errors.overview ? "textarea-error" : ""
              }`}
            />
            <p className="mt-1.5 text-xs text-base-content/60">
              Tip: Mention ceiling height, sound isolation rating, electrical power capacity, and setup rules to attract serious commercial bookings.
            </p>
            {errors.overview && (
              <p className="mt-1 text-xs text-error flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.overview}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <Link
            href="/my-listings"
            className="btn btn-ghost btn-sm sm:btn-md rounded-xl text-base-content/70 hover:text-base-content"
          >
            Cancel & Return
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="btn btn-primary rounded-xl px-7 gap-2 shadow-sm font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing Listing...
                </>
              ) : isUploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Image...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Publish Studio Listing
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
