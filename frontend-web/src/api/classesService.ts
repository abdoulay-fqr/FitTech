import axiosInstance from "./axiosInstance";

export type GymClass = {
  id: string;
  name: string;
  description?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  level: string;
  status: string;
  maxParticipants?: number;
  coachId?: string;
  coachName?: string;
};

export type CreateClassRequest = {
  name: string;
  description: string;
  level: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
};

export type PagedResponse<T> = {
  content: T[];
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  hasMore?: boolean;
  last?: boolean;
};

// ─── Get classes by coach ─────────────────────────────────────────────────────
export async function getCoachClasses(
  coachId: string,
  page = 0,
  size = 9
): Promise<PagedResponse<GymClass>> {
  const response = await axiosInstance.get(`/users/classes/coach/${coachId}`, {
    params: { page, size },
  });
  return response.data;
}

// ─── Create class ─────────────────────────────────────────────────────────────
export async function createClass(data: CreateClassRequest): Promise<GymClass> {
  const response = await axiosInstance.post("/users/classes", data);
  return response.data;
}

// ─── Get all classes ──────────────────────────────────────────────────────────
export async function getClasses(
  page = 0,
  size = 9,
  search = ""
): Promise<PagedResponse<GymClass>> {
  const response = await axiosInstance.get("/users/classes", {
    params: { page, size, search },
  });
  return response.data;
}

// ─── Get class by ID ──────────────────────────────────────────────────────────
export async function getClassById(id: string): Promise<GymClass> {
  const response = await axiosInstance.get(`/users/classes/${id}`);
  return response.data;
}

// ─── Update class ─────────────────────────────────────────────────────────────
export async function updateClass(
  id: string,
  data: Partial<CreateClassRequest>
): Promise<GymClass> {
  const response = await axiosInstance.put(`/users/classes/${id}`, data);
  return response.data;
}

// ─── Delete class ─────────────────────────────────────────────────────────────
export async function deleteClass(id: string): Promise<void> {
  await axiosInstance.delete(`/users/classes/${id}`);
}