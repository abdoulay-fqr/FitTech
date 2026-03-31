export type AdminProfile = {
    id: string;
    authId: string;
    firstName: string;
    secondName: string;
    phone: string;
    birthDate: string;
    gender: "MALE" | "FEMALE";
    profilePic: string | null;
};