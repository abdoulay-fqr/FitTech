import axiosInstance from "../api/axiosInstance";
import type { AdminProfile, AdminsResponse, CreateAdminPayload } from "../types/admin";

export const adminService = {
    async getMyProfile(): Promise<AdminProfile> {
        const response = await axiosInstance.get<AdminProfile>("/users/admins/me");
        return response.data;
    },

    async updateMyProfile(payload: {
        firstName: string;
        secondName: string;
        phone: string;
        birthDate: string;
        gender: "MALE" | "FEMALE";
        profilePic: string | null;
    }): Promise<AdminProfile> {
        const response = await axiosInstance.put<AdminProfile>(
            "/users/admins/me",
            payload
        );
        return response.data;
    },

    async uploadMyProfilePicture(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post<string>(
            "/users/admins/me/pic",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    async getAllAdmins() {
        let page = 0;
        let hasMore = true;
        const allAdmins: AdminProfile[] = [];

        while (hasMore) {
            const response = await axiosInstance.get<AdminsResponse>(
                `/users/admins?page=${page}&size=10`
            );

            allAdmins.push(...response.data.content);
            hasMore = response.data.hasMore;
            page += 1;
        }

        return allAdmins;
    },

    async getAdminById(id: string): Promise<AdminProfile> {
        const response = await axiosInstance.get<AdminProfile>(`/users/admins/${id}`);
        return response.data;
    },

    async createAdmin(payload: CreateAdminPayload) {
        const response = await axiosInstance.post("/users/admins", payload);
        return response.data;
    },

    async updateAdminById(
        id: string,
        payload: {
            firstName: string;
            secondName: string;
            phone: string;
            birthDate: string;
            gender: "MALE" | "FEMALE";
        }
    ): Promise<AdminProfile> {
        const response = await axiosInstance.put<AdminProfile>(`/users/admins/${id}`, payload);
        return response.data;
    },

    async uploadAdminPicture(id: string, file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post<string>(
            `/users/admins/${id}/pic`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    }
};