// ─────────────────────────────────────────────
// SERVICE – FreeTrial
// Routes : /users/trials
// ─────────────────────────────────────────────
import axiosInstance from "./axiosInstance";

// ── Type exact retourné par le backend ────────
// {
//   "id": "5318a801-...",
//   "fullName": "Mehdi Cherif",   ← directement fullName
//   "email": "mehdi.cherif@gmail.com",
//   "createdAt": "2026-03-22T...",
//   "used": false
// }
export interface FreeTrial {
  id: string;
  fullName: string;   // ✅ le backend envoie fullName directement
  email: string;
  createdAt: string;
  used: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;       // le backend renvoie "page" (pas "number")
  size: number;
  hasMore: boolean;
}

// ── GET /users/trials ─────────────────────────
export async function getAllTrials(
  search?: string,
  used?: boolean,
  page: number = 0,
  size: number = 10
): Promise<PagedResponse<FreeTrial>> {
  const res = await axiosInstance.get<PagedResponse<FreeTrial>>("/users/trials", {
    params: {
      ...(search ? { search } : {}),
      ...(used !== undefined ? { used } : {}),
      page,
      size,
    },
  });
  return res.data;
}

// ── PUT /users/trials/use/:id ─────────────────
export async function approveTrial(id: string): Promise<FreeTrial> {
  const res = await axiosInstance.put<FreeTrial>(`/users/trials/use/${id}`);
  return res.data;
}

// ── DELETE /users/trials/:id ──────────────────
export async function deleteTrial(id: string): Promise<void> {
  await axiosInstance.delete(`/users/trials/${id}`);
}