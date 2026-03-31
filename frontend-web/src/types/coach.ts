export type Coach = {
    id: string;
    authId: string;
    firstName: string;
    secondName: string;
    phone: string;
    birthDate: string;
    gender: "MALE" | "FEMALE";
    specialties: string;
    biography: string;
    profilePic: string | null;
};

export type CoachesResponse = {
    content: Coach[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasMore: boolean;
};