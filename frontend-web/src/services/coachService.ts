import axiosInstance from "../api/axiosInstance";
import type {
    Coach,
    CoachesResponse,
    UpdateCoachPayload,
    CreateCoachAuthPayload,
    CoachClass,
    CoachClassesResponse,
    CreateCoachClassPayload,
} from "../types/coach";

export const coachService = {
    async getAllCoaches(): Promise<Coach[]> {
        let page = 0;
        let hasMore = true;
        const allCoaches: Coach[] = [];

        while (hasMore) {
            const response = await axiosInstance.get<CoachesResponse>(
                `/users/coaches?page=${page}&size=10`
            );

            allCoaches.push(...response.data.content);
            hasMore = response.data.hasMore;
            page += 1;
        }

        return allCoaches;
    },

    async getCoachById(id: string): Promise<Coach> {
        const response = await axiosInstance.get<Coach>(`/users/coaches/${id}`);
        return response.data;
    },

    async createCoach(payload: CreateCoachAuthPayload) {
        const response = await axiosInstance.post("/users/coaches", payload);
        return response.data;
    },

    async updateCoach(id: string, payload: UpdateCoachPayload): Promise<Coach> {
        const response = await axiosInstance.put<Coach>(`/users/coaches/${id}`, payload);
        return response.data;
    },

    async uploadCoachPicture(id: string, file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post<string>(
            `/users/coaches/${id}/pic`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    async getCoachClasses(coachId: string): Promise<CoachClass[]> {
        const response = await axiosInstance.get<CoachClassesResponse>(
            `/users/classes/coach/${coachId}?page=0&size=10`
        );
        return response.data.content;
    },

    async createCoachClass(payload: CreateCoachClassPayload): Promise<CoachClass> {
        const response = await axiosInstance.post<CoachClass>("/users/classes", payload);
        return response.data;
    },

    async deleteCoachClass(classId: string) {
        const response = await axiosInstance.delete(`/users/classes/${classId}`);
        return response.data;
    },
};