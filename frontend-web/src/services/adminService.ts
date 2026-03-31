import type { AdminProfile } from "../types/admin";

const API_BASE_URL = "http://localhost:8080";

export const adminService = {
    async getMyProfile(): Promise<AdminProfile> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token not found");
        }

        const response = await fetch(`${API_BASE_URL}/users/admins/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch admin profile: ${response.status}`);
        }

        return response.json();
    },

    async updateMyProfile(payload: {
        firstName: string;
        secondName: string;
        phone: string;
        birthDate: string;
        gender: "MALE" | "FEMALE";
        profilePic: string | null;
    }): Promise<AdminProfile> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token not found");
        }

        const response = await fetch(`${API_BASE_URL}/users/admins/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to update admin profile: ${response.status}`);
        }

        return response.json();
    },

    async uploadMyProfilePicture(file: File): Promise<string> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token not found");
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/users/admins/me/pic`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to upload profile picture: ${response.status}`);
        }

        return response.text();
    },
};