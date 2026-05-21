import axiosInstance from "./axiosInstance";

export interface Coach {
  id: string;
  authId: string;
  firstName: string;
  secondName: string;
  phone: string;
  birthDate: string;
  gender: string;
  specialties: string;
  biography: string;
  profilePic: string | null;
}

export interface CoachesResponse {
  content: Coach[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasMore: boolean;
}

export async function getCoaches(page = 0, size = 10, search = ""): Promise<CoachesResponse> {
  const response = await axiosInstance.get("/users/coaches", {
    params: { page, size, search },
  });
  return response.data;
}