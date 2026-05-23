import type { Coach } from "../types/coach";
import avatar from "../assets/avatar1.png";

export const mockCoaches: Coach[] = [
    {
        id: "a11b29e6-def5-4a4b-9475-2b518c0becb3",
        authId: "2d4d930d-689a-4aba-8312-3528d1afab91",
        firstName: "Ahmed",
        secondName: "Benali",
        phone: "0553333333",
        birthDate: "1988-05-10",
        gender: "MALE",
        specialties: "Cardio, HIIT, Spinning",
        biography:
            "Certified fitness coach with 10 years of experience specializing in high-intensity training and weight loss programs.",
        profilePic: avatar,
    },
    {
        id: "b22b29e6-def5-4a4b-9475-2b518c0becb4",
        authId: "3d4d930d-689a-4aba-8312-3528d1afab92",
        firstName: "Samir",
        secondName: "Kaci",
        phone: "0661111111",
        birthDate: "1990-08-20",
        gender: "MALE",
        specialties: "Yoga, Mobility",
        biography: "Coach focused on flexibility, posture and yoga practice.",
        profilePic: avatar,
    },
    {
        id: "c33b29e6-def5-4a4b-9475-2b518c0becb5",
        authId: "4d4d930d-689a-4aba-8312-3528d1afab93",
        firstName: "Nadia",
        secondName: "Khelifi",
        phone: "0777777777",
        birthDate: "1992-03-15",
        gender: "FEMALE",
        specialties: "Pool, Aqua Gym",
        biography: "Aqua fitness coach with strong experience in group sessions.",
        profilePic: avatar,
    },
    {
        id: "d44b29e6-def5-4a4b-9475-2b518c0becb6",
        authId: "5d4d930d-689a-4aba-8312-3528d1afab94",
        firstName: "Karim",
        secondName: "Touati",
        phone: "0666666666",
        birthDate: "1987-09-01",
        gender: "MALE",
        specialties: "Strength, Bodybuilding",
        biography: "Strength coach specialized in mass gain and hypertrophy.",
        profilePic: avatar,
    },
];