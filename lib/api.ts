export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === "string" && body.trim()) {
    return body.trim();
  }

  if (typeof body === "object" && body !== null) {
    const payload = body as { message?: unknown; error?: unknown };

    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  }

  return fallback;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T | undefined> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const base = apiUrl.replace(/\/$/, "").replace(/\/api$/, "");
  const cleanPath = path.replace(/^\//, "");
  const normalizedPath = cleanPath.startsWith("api/")
    ? cleanPath
    : `api/${cleanPath}`;

  let response: Response;
  try {
    response = await fetch(`${base}/${normalizedPath}`, {
      ...init,
      credentials: "include",
    });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "The network request failed.";
    throw new ApiError(`Could not reach the StudioSpace server: ${reason}`, 0);
  }

  const responseText = await response.text();
  let body: unknown;
  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      body = responseText;
    }
  }

  if (!response.ok) {
    const fallback = `Request failed (${response.status}${response.statusText ? ` ${response.statusText}` : ""}).`;
    throw new ApiError(getErrorMessage(body, fallback), response.status);
  }

  if (response.status === 204 || !responseText) {
    return undefined;
  }

  return body as T;
}
