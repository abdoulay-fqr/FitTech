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

export type UpdateCoachPayload = {
    firstName?: string;
    secondName?: string;
    phone?: string;
    birthDate?: string;
    gender?: "MALE" | "FEMALE";
    specialties?: string;
    biography?: string;
};

export type CreateCoachAuthPayload = {
    firstName: string;
    secondName: string;
    email: string;
    password: string;
    phone: string;
    birthDate: string;
    gender: "MALE" | "FEMALE";
    specialties: string;
    biography: string;
};

export type CoachClass = {
    id: string;
    coachId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
};

export type CoachClassesResponse = {
    content: CoachClass[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasMore: boolean;
};

export type CreateCoachClassPayload = {
    coachId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
};