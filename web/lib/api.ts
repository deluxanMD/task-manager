export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  cookieHeader?: string,
): Promise<T> {
  const baseUrl = process.env.GATEWAY_URL || "http://localhost:4000";
  const url = `${baseUrl}${path}`;

  // prepare headers
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  const fetchOptions: RequestInit = { ...options, headers };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `API Error: ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}
