import React, { useState } from "react";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/avatar1.png";
import { memberService } from "../services/memberService";

type Props = {
    onLogout: () => void;
};

const AddMemberPage: React.FC<Props> = ({ onLogout }) => {
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        email: "",
        password: "",
        phone: "",
        birthDate: "",
        objective: "",
        medicalRestrictions: "",
        gender: "MALE" as "MALE" | "FEMALE",
    });

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

        try {
            setSaving(true);
            setSaveError("");

            await memberService.createMember({
                firstName: formData.firstName,
                secondName: formData.secondName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                birthDate: formData.birthDate,
                gender: formData.gender,
                objective: formData.objective,
                medicalRestrictions: formData.medicalRestrictions,
            });

            navigate("/admin/home");
        } catch (err: any) {
            console.error(err);
            setSaveError(err.response?.data || err.message || "Failed to create member");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex flex-col gap-4 border-b border-[#ececec] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/admin/home")}
                                className="text-[#2f4053]"
                            >
                                <ArrowLeft size={18} strokeWidth={2.2} />
                            </button>
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">
                                Add Member
                            </h1>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="relative hidden md:block">
                                <Search
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                                />
                                <input
                                    type="text"
                                    placeholder="Search for members"
                                    className="h-10 w-[240px] rounded-md bg-[#f5f5f5] pl-9 pr-3 text-[12px] outline-none"
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
                            <img
                                src={fallbackAvatar}
                                alt="New member"
                                className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md md:h-24 md:w-24"
                            />
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
                                        <label className="text-[12px] text-[#111827]">First Name*</label>
                                        <input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#f2cc0c] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">Second Name*</label>
                                        <input
                                            name="secondName"
                                            value={formData.secondName}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">Email*</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">Password*</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">Phone Number</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-start gap-4">
                                        <label className="pt-2 text-[12px] text-[#111827]">Date of Birth</label>
                                        <input
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            className="h-9 w-full rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">Gender</label>
                                        <div className="flex items-center gap-6 text-[12px] text-[#111827]">
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
                            </div>

                            <div>
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Health Profile
                                </h3>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-[130px_1fr] items-start gap-4">
                                        <label className="pt-2 text-[12px] text-[#111827]">Goal</label>
                                        <textarea
                                            name="objective"
                                            value={formData.objective}
                                            onChange={handleChange}
                                            rows={3}
                                            className="rounded-[4px] border border-[#d9d9d9] px-3 py-2 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] items-start gap-4">
                                        <label className="pt-2 text-[12px] text-[#111827]">
                                            Medical Restrictions
                                        </label>
                                        <textarea
                                            name="medicalRestrictions"
                                            value={formData.medicalRestrictions}
                                            onChange={handleChange}
                                            rows={3}
                                            className="rounded-[4px] border border-[#d9d9d9] px-3 py-2 text-[12px] outline-none"
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

export default AddMemberPage;