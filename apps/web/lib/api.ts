import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type ApplicationStatus =
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface ApplicationOut {
  id: number;
  company: string;
  role: string;
  status: ApplicationStatus;
  applied_date: string | null;
  url: string | null;
  source: string | null;
  notes: string | null;
  created_at: string;
}

export interface ApplicationCreate {
  company: string;
  role: string;
  status?: ApplicationStatus;
  applied_date?: string | null;
  url?: string | null;
  source?: string | null;
  notes?: string | null;
}

export interface AuthUser {
  id: number;
  email: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterBody {
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as unknown as T;
  }
  const data = await res.json();
  if (!res.ok) {
    const err = data as ApiError;
    if (typeof err.detail === "string") {
      throw new Error(err.detail);
    } else if (Array.isArray(err.detail)) {
      throw new Error(err.detail.map((e) => e.msg).join(", "));
    }
    throw new Error("An unexpected error occurred");
  }
  return data as T;
}

// Auth
export async function register(body: RegisterBody): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<AuthUser>(res);
}

export async function login(body: LoginBody): Promise<TokenResponse> {
  const res = await fetch(`${BASE_URL}/auth/login-json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<TokenResponse>(res);
}

export async function logout(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  return handleResponse<void>(res);
}

export async function getMe(): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<AuthUser>(res);
}

// Applications
export interface GetApplicationsParams {
  status?: ApplicationStatus | "";
  search?: string;
  skip?: number;
  limit?: number;
}

export async function getApplications(
  params: GetApplicationsParams = {}
): Promise<ApplicationOut[]> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.skip !== undefined) query.set("skip", String(params.skip));
  if (params.limit !== undefined) query.set("limit", String(params.limit));

  const qs = query.toString();
  const res = await fetch(`${BASE_URL}/applications${qs ? `?${qs}` : ""}`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<ApplicationOut[]>(res);
}

export async function getApplication(id: number): Promise<ApplicationOut> {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<ApplicationOut>(res);
}

export async function createApplication(
  body: ApplicationCreate
): Promise<ApplicationOut> {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });
  return handleResponse<ApplicationOut>(res);
}

export async function updateApplication(
  id: number,
  body: Partial<ApplicationCreate>
): Promise<ApplicationOut> {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });
  return handleResponse<ApplicationOut>(res);
}

export async function deleteApplication(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  return handleResponse<void>(res);
}
