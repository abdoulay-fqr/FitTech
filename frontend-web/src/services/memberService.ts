import axiosInstance from "../api/axiosInstance";
import type {
    Member,
    MembersResponse,
    UpdateMemberPayload,
} from "../types/member";

export type CreateMemberAuthPayload = {
    firstName: string;
    secondName: string;
    email: string;
    password: string;
    phone: string;
    birthDate: string;
    gender: "MALE" | "FEMALE";
    objective: string;
    medicalRestrictions: string;
};

export const memberService = {
    async getAllMembers(): Promise<Member[]> {
        let page = 0;
        let hasMore = true;
        const allMembers: Member[] = [];

        while (hasMore) {
            const response = await axiosInstance.get<MembersResponse>(
                `/users/members?page=${page}&size=10`
            );

            allMembers.push(...response.data.content);
            hasMore = response.data.hasMore;
            page += 1;
        }

        return allMembers;
    },

    async getMemberById(id: string): Promise<Member> {
        const response = await axiosInstance.get<Member>(`/users/members/${id}`);
        return response.data;
    },

    async createMember(payload: CreateMemberAuthPayload): Promise<any> {
        const response = await axiosInstance.post("/users/members", payload);
        return response.data;
    },



    async uploadMemberPicture(id: string, file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post<string>(
            `/users/members/${id}/pic`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },


    async updateMember(id: string, payload: UpdateMemberPayload): Promise<Member> {
        const response = await axiosInstance.put<Member>(
            `/users/members/${id}`,
            payload
        );
        return response.data;
    },


    async resetMemberPassword(
        authId: string,
        newPassword: string,
        confirmPassword: string
    ) {
        const response = await axiosInstance.put(
            `/auth/admin/reset-password/${authId}`,
            {
                newPassword,
                confirmPassword,
            }
        );

        return response.data;
    },

    async suspendMember(memberId: string) {
        const response = await axiosInstance.put(
            `/users/members/suspend/${memberId}`
        );
        return response.data;
    },

    async unsuspendMember(memberId: string) {
        const response = await axiosInstance.put(
            `/users/members/unsuspend/${memberId}`
        );
        return response.data;
    },
};