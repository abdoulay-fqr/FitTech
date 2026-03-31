import type { Coach, CoachesResponse } from "../types/coach";

const API_BASE_URL = "http://localhost:8080";

export const coachService = {
    async getAllCoaches(): Promise<Coach[]> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token not found");
        }

        const response = await fetch(`${API_BASE_URL}/users/coaches`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch coaches: ${response.status}`);
        }

        const data: CoachesResponse = await response.json();
        return data.content;
    },

    async getCoachById(id: string): Promise<Coach> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token not found");
        }

        const response = await fetch(`${API_BASE_URL}/users/coaches/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch coach: ${response.status}`);
        }

        return response.json();
    },

    async updateCoach(
        id: string,
        payload: {
            firstName: string;
            secondName: string;
            phone: string;
            birthDate: string;
            gender: "MALE" | "FEMALE";
            specialties: string;
            biography: string;
            profilePic: string | null;
        }
    ): Promise<Coach> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token not found");
        }

        const response = await fetch(`${API_BASE_URL}/users/coaches/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to update coach: ${response.status}`);
        }

        return response.json();
    },
};