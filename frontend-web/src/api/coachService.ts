import axiosInstance from "./axiosInstance";

export interface CoachProfile {
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

export interface UpdateCoachRequest {
  phone?: string;
  birthDate?: string;
  gender?: string;
  specialties?: string;
  biography?: string;
}

export async function getCoachProfile(): Promise<CoachProfile> {
  const response = await axiosInstance.get("/users/coaches/me");
  return response.data;
}

export async function updateCoachProfile(
  data: UpdateCoachRequest
): Promise<CoachProfile> {
  const response = await axiosInstance.put("/users/coaches/me", data);
  return response.data;
}

export async function uploadCoachPicture(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  await axiosInstance.post("/users/coaches/me/pic", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}