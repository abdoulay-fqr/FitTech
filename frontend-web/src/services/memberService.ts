import type { Member, MembersResponse } from "../types/member";

const API_BASE_URL = "http://localhost:8080";

export const memberService = {
  async getAllMembers(): Promise<Member[]> {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    const response = await fetch(`${API_BASE_URL}/users/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch members: ${response.status}`);
    }

    const data: MembersResponse = await response.json();
    return data.content;
  },

  async getMemberById(id: string): Promise<Member> {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    const response = await fetch(`${API_BASE_URL}/users/members/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch member ${id}`);
    }

    return response.json();
  },

  async updateMember(
      id: string,
      payload: {
        firstName: string;
        secondName: string;
        phone: string;
        birthDate: string;
        objective: string;
        medicalRestrictions: string;
        nfcCardId: string;
        nfcActive: boolean;
        suspended: boolean;
        gender: "MALE" | "FEMALE";
        subscriptionPlan: "MONTHLY" | "ANNUAL" | "SESSION";
        subscriptionStatus: string;
        profilePic: string | null;
      }
  ): Promise<Member> {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    const response = await fetch(`${API_BASE_URL}/users/members/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update member: ${response.status}`);
    }

    return response.json();
  },
};