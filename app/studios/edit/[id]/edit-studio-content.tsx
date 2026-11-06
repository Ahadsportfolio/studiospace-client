"use client";

import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Camera,
  Check,
  DollarSign,
  Eye,
  Info,
  Link as LinkIcon,
  Loader2,
  Mail,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { uploadImageToImgbb } from "@/lib/imgbb";
import { useAuth } from "@/providers/auth-provider";
import { STUDIO_CATEGORIES, StudioCategory, Studio } from "@/types/studio";
import { EditStudioSkeleton } from "./edit-studio-skeleton";
import { EditStudio404 } from "./edit-studio-404";
import { EditStudio403 } from "./edit-studio-403";

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
  Workshop: "Creative fabrication labs, prop building, sculpture & art workshops",
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

interface EditStudioContentProps {
  params: Promise<{ id: string }>;
}

export function EditStudioContent({ params }: EditStudioContentProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Studio Loading & Error States
  const [studio, setStudio] = useState<Studio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [is403, setIs403] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<StudioCategory>("Photo Studio");
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [securityDeposit, setSecurityDeposit] = useState<string>("0");
  const [maxCapacity, setMaxCapacity] = useState<string>("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [overview, setOverview] = useState("");

  // Visual Media State
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Amenities State
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenityInput, setCustomAmenityInput] = useState("");

  // Submission State & Errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing studio details
  useEffect(() => {
    let isMounted = true;

    async function fetchStudio() {
      // Validate 24 hex char MongoDB ObjectId
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      if (!isValidObjectId) {
        if (isMounted) {
          setIs404(true);
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await apiFetch<Studio>(`/api/studios/${id}`);
        if (!isMounted) return;

        if (!data || !data._id) {
          setIs404(true);
          setIsLoading(false);
          return;
        }

        // Check ownership against current user
        if (
          user &&
          data.ownerEmail &&
          user.email?.toLowerCase() !== data.ownerEmail.toLowerCase()
        ) {
          setIs403(true);
          setStudio(data);
          setIsLoading(false);
          return;
        }

        // Populate form with existing studio data
        setStudio(data);
        setTitle(data.title || "");
        if (STUDIO_CATEGORIES.includes(data.category)) {
          setCategory(data.category);
        }
        setHourlyRate(data.hourlyRate !== undefined ? String(data.hourlyRate) : "85");
        setSecurityDeposit(
          data.securityDeposit !== undefined ? String(data.securityDeposit) : "0"
        );
        setMaxCapacity(data.maxCapacity !== undefined ? String(data.maxCapacity) : "10");
        setLocation(data.location || "");
        setCity(data.city || "");
        setImageUrl(data.image || "");
        setGallery(
          Array.isArray(data.gallery) && data.gallery.length > 0
            ? data.gallery
            : data.image
              ? [data.image]
              : []
        );
        setSelectedAmenities(Array.isArray(data.amenities) ? data.amenities : []);
        setOverview(data.overview || "");
        setIsLoading(false);
      } catch (err: unknown) {
        if (!isMounted) return;

        if (err instanceof ApiError) {
          if (err.status === 404) {
            setIs404(true);
          } else if (err.status === 403) {
            setIs403(true);
          } else {
            toast.error(err.message || "Failed to load studio details.");
          }
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Failed to load studio details.");
        }
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      fetchStudio();
    }

    return () => {
      isMounted = false;
    };
  }, [id, user, authLoading]);

  // Toggle amenity selection
  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
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
        (a) => a.toLowerCase() === trimmed.toLowerCase()
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
      // Also update gallery cover
      setGallery((prev) => [uploadedUrl, ...prev.filter((u) => u !== uploadedUrl)]);
      toast.success("New cover image successfully uploaded to ImgBB!");
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Validate form fields
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
    if (securityDeposit !== "" && (isNaN(depositNum) || depositNum < 0)) {
      newErrors.securityDeposit = "Security deposit must be $0 or greater.";
    }

    const capNum = Number(maxCapacity);
    if (!maxCapacity || isNaN(capNum) || capNum < 1 || !Number.isInteger(capNum)) {
      newErrors.maxCapacity =
        "Max capacity must be a positive whole number (at least 1).";
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

  // Handle Form Submission via PUT /api/studios/:id
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanImageUrl = imageUrl.trim();
      const updatedGallery = gallery.length > 0 ? gallery : [cleanImageUrl];
      // Ensure primary image is included in gallery
      if (!updatedGallery.includes(cleanImageUrl)) {
        updatedGallery.unshift(cleanImageUrl);
      }

      const payload = {
        title: title.trim(),
        category,
        hourlyRate: Number(hourlyRate),
        securityDeposit: securityDeposit ? Number(securityDeposit) : 0,
        maxCapacity: Math.floor(Number(maxCapacity)),
        location: location.trim(),
        city: city.trim() || undefined,
        image: cleanImageUrl,
        gallery: updatedGallery,
        amenities: selectedAmenities,
        overview: overview.trim(),
      };

      await apiFetch<Studio>(`/api/studios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast.success("Studio listing updated successfully!");
      router.push("/my-listings");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setIs403(true);
          toast.error("Forbidden: You do not have permission to edit this studio.");
          return;
        }
        if (err.status === 404) {
          setIs404(true);
          toast.error("Studio not found or has been removed.");
          return;
        }
        toast.error(err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to update studio. Please check your inputs and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // State: Loading
  if (isLoading || authLoading) {
    return <EditStudioSkeleton />;
  }

  // State: 404 Not Found
  if (is404) {
    return <EditStudio404 studioId={id} />;
  }

  // State: 403 Forbidden
  if (is403) {
    return (
      <EditStudio403
        studioId={id}
        studioTitle={studio?.title}
        studioCategory={studio?.category}
        ownerEmail={studio?.ownerEmail}
        currentEmail={user?.email || undefined}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back navigation & page title */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <Link
            href="/my-listings"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-base-content/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to My Listings
          </Link>

          {studio?._id && (
            <Link
              href={`/studios/${studio._id}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-base-content/70 hover:text-primary transition-colors"
              target="_blank"
              title="Preview public studio page in a new tab"
            >
              <Eye className="h-3.5 w-3.5" /> View Public Page
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Studio Workspace Editor</span>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
              Update Studio Listing
            </h1>
            <p className="mt-1.5 text-sm text-base-content/70 sm:text-base">
              Update your workspace specifications, equipment inclusions, hourly rates, and photos.
            </p>
          </div>

          {studio?.category && (
            <span className="badge badge-lg badge-outline border-primary/30 text-primary font-medium">
              {studio.category}
            </span>
          )}
        </div>
      </div>

      {/* Host Identity Card (Read-only Name & Email from Studio record) */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-base-300/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/80">
              Host Ownership Information (Read-Only)
            </span>
          </div>
          <span className="badge badge-sm badge-success gap-1 text-[11px] font-medium">
            <UserCheck className="h-3 w-3" /> Host Verified
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Read-only Host Name */}
          <div>
            <label className="block text-xs font-medium text-base-content/70 mb-1">
              Host Name (Immutable)
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                disabled
                value={studio?.ownerName || user?.name || "Studio Host"}
                className="input input-bordered w-full bg-base-100/70 text-base-content font-medium opacity-90 cursor-not-allowed pl-9"
              />
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
            </div>
          </div>

          {/* Read-only Host Email */}
          <div>
            <label className="block text-xs font-medium text-base-content/70 mb-1">
              Host Email (Immutable)
            </label>
            <div className="relative">
              <input
                type="email"
                readOnly
                disabled
                value={studio?.ownerEmail || user?.email || ""}
                className="input input-bordered w-full bg-base-100/70 text-base-content font-medium opacity-90 cursor-not-allowed pl-9"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
            </div>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-base-content/60">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Listing ownership and payouts are bound to this verified host profile and cannot be transferred through the editor.
        </p>
      </div>

      {/* Main Studio Update Form */}
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
                  Metro / City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Brooklyn, NY"
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
              Pricing & Production Capacity
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
                  className={`input input-bordered w-full pl-9 ${
                    errors.hourlyRate ? "input-error" : ""
                  }`}
                />
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
              </div>
              <span className="mt-1 text-[11px] text-base-content/60 block">
                Creator rate per hour
              </span>
              {errors.hourlyRate && (
                <p className="mt-1 text-xs text-error flex items-center gap-1">
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
                <input
                  id="securityDeposit"
                  type="number"
                  min="0"
                  step="1"
                  value={securityDeposit}
                  onChange={(e) => {
                    setSecurityDeposit(e.target.value);
                    if (errors.securityDeposit) {
                      setErrors((prev) => ({
                        ...prev,
                        securityDeposit: undefined,
                      }));
                    }
                  }}
                  placeholder="100"
                  className={`input input-bordered w-full pl-9 ${
                    errors.securityDeposit ? "input-error" : ""
                  }`}
                />
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
              </div>
              <span className="mt-1 text-[11px] text-base-content/60 block">
                Refundable gear deposit (0 if none)
              </span>
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
                Max Capacity (People) <span className="text-error">*</span>
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
                  className={`input input-bordered w-full pl-9 ${
                    errors.maxCapacity ? "input-error" : ""
                  }`}
                />
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
              </div>
              <span className="mt-1 text-[11px] text-base-content/60 block">
                Cast, crew & guest limit
              </span>
              {errors.maxCapacity && (
                <p className="mt-1 text-xs text-error flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.maxCapacity}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Visual Media & Studio Imagery */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-base-200">
            <div className="flex items-center gap-2.5">
              <Camera className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-serif text-lg font-medium text-base-content">
                  Studio Imagery & Cover Photo
                </h2>
                <p className="text-xs text-base-content/65">
                  High-resolution photo showcases your cyc wall, stage lighting, and lounge setup.
                </p>
              </div>
            </div>

            {/* Mode Toggle Button */}
            <div className="inline-flex rounded-xl border border-base-300 bg-base-200/60 p-1">
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`btn btn-xs rounded-lg gap-1 font-medium transition-all ${
                  imageMode === "upload"
                    ? "btn-primary shadow-xs"
                    : "btn-ghost text-base-content/70"
                }`}
              >
                <Upload className="h-3 w-3" /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`btn btn-xs rounded-lg gap-1 font-medium transition-all ${
                  imageMode === "url"
                    ? "btn-primary shadow-xs"
                    : "btn-ghost text-base-content/70"
                }`}
              >
                <LinkIcon className="h-3 w-3" /> Direct URL
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {imageMode === "upload" ? (
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                    isUploadingImage
                      ? "border-primary bg-primary/5 cursor-wait"
                      : "border-base-300 hover:border-primary/60 hover:bg-base-200/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploadingImage}
                    className="hidden"
                  />

                  {isUploadingImage ? (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm font-medium text-base-content">
                        Uploading to ImgBB...
                      </p>
                      <p className="text-xs text-base-content/60">
                        Optimizing image dimensions and generating CDN link.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-base-content">
                        Click to upload new studio photo
                      </p>
                      <p className="text-xs text-base-content/60">
                        PNG, JPG, WEBP or GIF (ImgBB hosted CDN, up to 16MB)
                      </p>
                    </div>
                  )}
                </div>

                {imageUploadError && (
                  <p className="mt-2 text-xs text-error flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {imageUploadError}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-base-content mb-1.5"
                >
                  Image URL <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    id="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (errors.image) {
                        setErrors((prev) => ({ ...prev, image: undefined }));
                      }
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`input input-bordered w-full pl-9 ${
                      errors.image ? "input-error" : ""
                    }`}
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
                </div>
                {errors.image && (
                  <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.image}
                  </p>
                )}
              </div>
            )}

            {/* Live Image Preview */}
            {imageUrl && (
              <div className="mt-4 rounded-2xl border border-base-300 bg-base-200/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
                    Cover Photo Preview
                  </span>
                  <span className="badge badge-sm badge-success gap-1 text-[11px]">
                    <Check className="h-3 w-3" /> Active Preview
                  </span>
                </div>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-base-300 bg-base-300 sm:max-h-72">
                  <Image
                    src={imageUrl}
                    alt={title || "Studio preview"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    unoptimized
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
                  <span className="truncate max-w-[80%] font-mono text-[11px]">
                    {imageUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="btn btn-ghost btn-xs text-error gap-1"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Amenities & Production Gear */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-base-200">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-serif text-lg font-medium text-base-content">
                  Amenities & Equipment Inclusions
                </h2>
                <p className="text-xs text-base-content/65">
                  Select available production equipment, acoustics, backdrops, and facilities.
                </p>
              </div>
            </div>
            <span className="badge badge-sm badge-primary font-semibold">
              {selectedAmenities.length} selected
            </span>
          </div>

          <div className="space-y-5">
            {/* Curated Popular Amenities */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70 mb-3">
                Popular Inclusions (click to toggle)
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_AMENITIES.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all border ${
                        isSelected
                          ? "border-primary bg-primary text-primary-content shadow-xs"
                          : "border-base-300 bg-base-200/60 text-base-content hover:border-primary/40 hover:bg-base-200"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Plus className="h-3 w-3 text-base-content/50" />
                      )}
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amenity Adder */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70 mb-1.5">
                Add Custom Amenity or Gear
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAmenityInput}
                  onChange={(e) => setCustomAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomAmenity();
                    }
                  }}
                  placeholder="e.g. Teleprompter with iPad mount"
                  className="input input-bordered input-sm flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="btn btn-primary btn-sm rounded-xl gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Active Selected Amenities List */}
            {selectedAmenities.length > 0 && (
              <div className="rounded-xl border border-base-300 bg-base-200/50 p-4">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-base-content/65 mb-2.5">
                  Currently Included in Listing:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAmenities.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-lg bg-base-100 border border-base-300 px-2.5 py-1 text-xs font-medium text-base-content"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => toggleAmenity(item)}
                        className="text-base-content/50 hover:text-error transition-colors ml-0.5"
                        title={`Remove ${item}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {errors.amenities && (
              <p className="text-xs text-error flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.amenities}
              </p>
            )}
          </div>
        </div>

        {/* Section 5: Detailed Workspace Overview */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-base-200">
            <h2 className="font-serif text-lg font-medium text-base-content">
              Detailed Overview & Rules
            </h2>
            <span className="text-xs text-base-content/60 font-mono">
              {overview.length} chars
            </span>
          </div>

          <div>
            <label
              htmlFor="overview"
              className="block text-sm font-medium text-base-content mb-1.5"
            >
              Studio Description <span className="text-error">*</span>
            </label>
            <textarea
              id="overview"
              rows={6}
              value={overview}
              onChange={(e) => {
                setOverview(e.target.value);
                if (errors.overview) {
                  setErrors((prev) => ({ ...prev, overview: undefined }));
                }
              }}
              placeholder="Describe your studio space, acoustics, power supply, ceiling height, staging areas, parking access, and house rules..."
              className={`textarea textarea-bordered w-full leading-relaxed ${
                errors.overview ? "textarea-error" : ""
              }`}
            />
            <p className="mt-1.5 text-xs text-base-content/60">
              Clear overviews help filmmakers, photographers, and audio engineers determine suitability. Minimum 20 characters.
            </p>
            {errors.overview && (
              <p className="mt-1 text-xs text-error flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.overview}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-base-200">
          <Link
            href="/my-listings"
            className="btn btn-ghost rounded-xl font-medium text-base-content/70 hover:text-base-content"
          >
            Cancel & Return
          </Link>

          <div className="flex items-center gap-3">
            {studio?._id && (
              <Link
                href={`/studios/${studio._id}`}
                className="btn btn-outline rounded-xl font-medium"
              >
                View Live Page
              </Link>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary rounded-xl font-medium gap-2 min-w-40 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
