/**
 * Utility for uploading image files to ImgBB using the ImgBB REST API.
 */

export interface ImgbbUploadResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export async function uploadImageToImgbb(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!apiKey) {
    throw new Error(
      "ImgBB API key is missing. Please set NEXT_PUBLIC_IMGBB_KEY in your environment configuration.",
    );
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file (JPEG, PNG, WEBP, GIF).");
  }

  // Validate file size (max 16MB)
  const maxBytes = 16 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("Image file size must be less than 16MB.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body: formData,
    },
  );

  let result: Partial<ImgbbUploadResponse> & { error?: { message?: string } };
  try {
    result = await response.json();
  } catch {
    throw new Error(
      `ImgBB upload failed with HTTP status ${response.status}.`,
    );
  }

  if (!response.ok || !result.success || !result.data?.url) {
    const errorMsg =
      result.error?.message ||
      "Failed to upload image to ImgBB. Please try again or provide a direct image URL.";
    throw new Error(errorMsg);
  }

  // Prefer display_url (direct image CDN link), fallback to url
  return result.data.display_url || result.data.url;
}

