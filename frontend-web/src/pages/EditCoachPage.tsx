import React, { useEffect, useState } from "react";
import { ArrowLeft, Bell, Camera, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/avatar1.png";
import { coachService } from "../services/coachService";
import type { Coach } from "../types/coach";

type Props = {
    onLogout: () => void;
};

const EditCoachPage: React.FC<Props> = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [coach, setCoach] = useState<Coach | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [saveError, setSaveError] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        phone: "",
        birthDate: "",
        gender: "MALE" as "MALE" | "FEMALE",
        specialties: "",
        biography: "",
        profilePic: null as string | null,
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const fetchCoach = async () => {
            try {
                if (!id) return;
                setLoading(true);
                setError("");
                const data = await coachService.getCoachById(id);
                setCoach(data);

                setFormData({
                    firstName: data.firstName,
                    secondName: data.secondName,
                    phone: data.phone,
                    birthDate: data.birthDate,
                    gender: data.gender,
                    specialties: data.specialties,
                    biography: data.biography,
                    profilePic: data.profilePic,
                    password: "",
                    confirmPassword: "",
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load coach");
            } finally {
                setLoading(false);
            }
        };

        fetchCoach();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;

        try {
            setSaving(true);
            setSaveError("");

            await coachService.updateCoach(id, {
                firstName: formData.firstName,
                secondName: formData.secondName,
                phone: formData.phone,
                birthDate: formData.birthDate,
                gender: formData.gender,
                specialties: formData.specialties,
                biography: formData.biography,
                profilePic: formData.profilePic,
            });

            navigate(`/admin/coaches/${id}`);
        } catch (err) {
            console.error(err);
            setSaveError("Failed to save coach changes");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading coach...</div>;
    }

    if (error || !coach) {
        return <div className="p-6 text-red-500">Coach not found</div>;
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex flex-col gap-4 border-b border-[#ececec] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(`/admin/coaches/${coach.id}`)}
                                className="text-[#2f4053]"
                            >
                                <ArrowLeft size={18} strokeWidth={2.2} />
                            </button>
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">Edit Coach</h1>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="relative hidden md:block">
                                <Search
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                                />
                                <input
                                    type="text"
                                    placeholder="Search for coach"
                                    className="h-10 w-[295px] rounded-md bg-[#f5f5f5] pl-9 pr-3 text-[12px] outline-none"
                                />
                            </div>

                            <button className="flex items-center gap-2 text-[13px] text-[#2f4053]">
                                <Bell size={15} />
                                <span>Notifications</span>
                            </button>
                        </div>
                    </div>

                    <div className="h-[125px] w-full overflow-hidden md:h-[150px]">
                        <img src={cover} alt="Gym cover" className="h-full w-full object-cover" />
                    </div>

                    <form onSubmit={handleSave} className="px-4 pb-10 md:px-8">
                        <div className="-mt-12 mb-4 md:-mt-14">
                            <div className="relative inline-block">
                                <img
                                    src={formData.profilePic || fallbackAvatar}
                                    alt={formData.firstName}
                                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md md:h-24 md:w-24"
                                />
                                <button
                                    type="button"
                                    className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f2cc0c] text-white shadow"
                                >
                                    <Camera size={16} />
                                </button>
                            </div>
                            <p className="mt-3 text-[12px] font-semibold text-[#f2cc0c]">
                                Upload new picture
                            </p>
                        </div>

                        {saveError && (
                            <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-[13px] text-red-500">
                                {saveError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                            <div>
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Personal Information
                                </h3>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-[130px_1fr] items-center gap-4">
                                        <label className="text-[12px]">First Name*</label>
                                        <input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#f2cc0c] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-center gap-4">
                                        <label className="text-[12px]">Second Name*</label>
                                        <input
                                            name="secondName"
                                            value={formData.secondName}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-center gap-4">
                                        <label className="text-[12px]">Phone</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-start gap-4">
                                        <label className="pt-2 text-[12px]">Date of Birth</label>
                                        <div>
                                            <input
                                                name="birthDate"
                                                value={formData.birthDate}
                                                onChange={handleChange}
                                                className="h-9 w-full rounded-[4px] border border-[#ff6b6b] px-3 text-[12px] outline-none"
                                            />
                                            <p className="mt-1 text-[10px] text-[#ff6b6b]">
                                                Please enter a valid date of birth.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-center gap-4">
                                        <label className="text-[12px]">Gender</label>
                                        <div className="flex items-center gap-6 text-[12px]">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="MALE"
                                                    checked={formData.gender === "MALE"}
                                                    onChange={handleChange}
                                                    className="accent-[#f2cc0c]"
                                                />
                                                Man
                                            </label>

                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="FEMALE"
                                                    checked={formData.gender === "FEMALE"}
                                                    onChange={handleChange}
                                                />
                                                Woman
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="mb-4 mt-8 text-[15px] font-semibold text-[#111827]">
                                    Professional Profile
                                </h3>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-[130px_1fr] items-center gap-4">
                                        <label className="text-[12px]">Specialities</label>
                                        <input
                                            name="specialties"
                                            value={formData.specialties}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#cfcfcf] bg-white px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-start gap-4">
                                        <label className="pt-2 text-[12px]">Biography</label>
                                        <textarea
                                            name="biography"
                                            value={formData.biography}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Biography"
                                            className="rounded-[4px] border border-[#d9d9d9] px-3 py-2 text-[12px] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Security
                                </h3>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                        <label className="text-[12px]">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="New Password"
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                        <label className="text-[12px]">Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="New Password"
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="mt-14 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-md bg-[#f2cc0c] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditCoachPage;