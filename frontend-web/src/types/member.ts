export type Member = {
  id: string;
  authId: string;
  firstName: string;
  secondName: string;
  phone: string;
  birthDate: string;
  objective: string;
  medicalRestrictions: string;
  nfcCardId: string | null;
  nfcActive: boolean;
  suspended: boolean;
  gender: "MALE" | "FEMALE";
  profilePic: string | null;
  subscriptionPlan: string | null;
  subscriptionStatus: string | null;
};

export type MembersResponse = {
  content: Member[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasMore: boolean;
};

export type CreateMemberPayload = {
  firstName: string;
  secondName: string;
  phone: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  objective: string;
  medicalRestrictions: string;
};

export type UpdateMemberPayload = {
  firstName?: string;
  secondName?: string;
  phone?: string;
  birthDate?: string;
  gender?: "MALE" | "FEMALE";
  objective?: string;
  medicalRestrictions?: string;
  subscriptionPlan?: string | null;
  subscriptionStatus?: string | null;
};