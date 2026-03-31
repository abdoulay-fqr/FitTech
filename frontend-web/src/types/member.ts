export type Member = {
  id: string;
  authId: string;
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
  profilePic: string | null;
  subscriptionPlan: "MONTHLY" | "ANNUAL" | "SESSION";
  subscriptionStatus: "ACTIVE" | "EXPIRED" | string;
};

export type MembersResponse = {
  content: Member[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasMore: boolean;
};