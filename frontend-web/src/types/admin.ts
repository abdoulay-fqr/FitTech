export type AdminProfile = {
    id: string;
    authId: string;
    firstName: string;
    secondName: string;
    phone: string;
    birthDate: string;
    gender: "MALE" | "FEMALE";
    profilePic: string | null;
    superAdmin: boolean;
    email?: string | null;
};

export type AdminsResponse = {
    content: AdminProfile[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasMore: boolean;
};

export type CreateAdminPayload = {
    firstName: string;
    secondName: string;
    email: string;
    password: string;
    phone: string;
    birthDate: string;
    gender: "MALE" | "FEMALE";
};