import React, { useState } from "react";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/noprofil.png";
import { coachService } from "../services/coachService";

type Props = {
    onLogout: () => void;
};

const AddCoachPage: React.FC<Props> = ({ onLogout }) => {
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        email: "",
        password: "",
        phone: "",
        birthDate: "",
        gender: "MALE" as "MALE" | "FEMALE",
        specialties: "",
        biography: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "gender" ? (value as "MALE" | "FEMALE") : value,
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await coachService.createCoach({
                firstName: formData.firstName,
                secondName: formData.secondName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                birthDate: formData.birthDate,
                gender: formData.gender,
                specialties: formData.specialties,
                biography: formData.biography,
            });

            navigate("/admin/coaches");
        } catch (err: any) {
            setError(err.response?.data || err.message || "Failed to create coach");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex items-center justify-between border-b px-4 py-5 md:px-7">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate("/admin/coaches")}>
                                <ArrowLeft size={18} />
                            </button>
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">
                                Add Coach
                            </h1>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                                <input
                                    type="text"
                                    placeholder="Search for coachs"
                                    className="h-10 w-[240px] rounded-md bg-[#f5f5f5] pl-9 pr-3 text-[12px]"
                                />
                            </div>

                            <button className="flex items-center gap-2 text-[13px]">
                                <Bell size={15} />
                                Notifications
                            </button>
                        </div>
                    </div>

                    <div className="h-[145px]">
                        <img src={cover} alt="cover" className="h-full w-full object-cover" />
                    </div>

                    <form onSubmit={handleSave} className="px-5 pb-10 md:px-7">
                        <div className="-mt-12 mb-5">
                            <img
                                src={fallbackAvatar}
                                alt="New coach"
                                className="h-24 w-24 rounded-full border-4 border-white object-cover"
                            />
                        </div>

                        {error && (
                            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-red-500">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            <div>
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Personal Information
                                </h3>

                                <div className="space-y-3">
                                    <input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        className="h-10 w-full rounded border px-3"
                                    />

                                    <input
                                        name="secondName"
                                        value={formData.secondName}
                                        onChange={handleChange}
                                        placeholder="Second Name"
                                        className="h-10 w-full rounded border px-3"
                                    />

                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="h-10 w-full rounded border px-3"
                                    />

                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="h-10 w-full rounded border px-3"
                                    />

                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="h-10 w-full rounded border px-3"
                                    />

                                    <input
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        placeholder="YYYY-MM-DD"
                                        className="h-10 w-full rounded border px-3"
                                    />

                                    <div className="flex items-center gap-6 text-[14px]">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="MALE"
                                                checked={formData.gender === "MALE"}
                                                onChange={handleChange}
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

                            <div>
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Professional Profile
                                </h3>

                                <div className="space-y-3">
                                    <input
                                        name="specialties"
                                        value={formData.specialties}
                                        onChange={handleChange}
                                        placeholder="Speciality"
                                        className="h-10 w-full rounded border px-3"
                                    />

                                    <textarea
                                        name="biography"
                                        value={formData.biography}
                                        onChange={handleChange}
                                        placeholder="Biography"
                                        rows={4}
                                        className="w-full rounded border px-3 py-2"
                                    />
                                </div>

                                <div className="mt-10 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded bg-[#f2cc0c] px-6 py-2 text-white"
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

export default AddCoachPage;