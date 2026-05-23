import React, { useState } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/noprofil.png";
import { changePassword } from "../api/auth.service";


type Props = {
    onLogout: () => void;
};

const EditSuperAdminPasswordPage: React.FC<Props> = ({ onLogout }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setError("");

            await changePassword(
                formData.oldPassword,
                formData.newPassword,
                formData.confirmPassword
            );

            navigate("/super-admin/settings");
        } catch (err: any) {
            setError(err.response?.data || err.message || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex items-center justify-between border-b border-[#ececec] px-4 py-5 md:px-7">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate("/super-admin/settings")}>
                                <ArrowLeft size={18} />
                            </button>
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">
                                Edit password
                            </h1>
                        </div>

                        <button className="flex items-center gap-2 text-[13px] text-[#2f4053]">
                            <Bell size={15} />
                            <span>Notifications</span>
                        </button>
                    </div>

                    <div className="h-[125px] w-full overflow-hidden md:h-[145px]">
                        <img src={cover} alt="Gym cover" className="h-full w-full object-cover" />
                    </div>

                    <form onSubmit={handleSave} className="px-5 pb-10 md:px-7">
                        <div className="-mt-12 mb-5 md:-mt-14">
                            <img
                                src={fallbackAvatar}
                                alt="Super admin"
                                className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md md:h-24 md:w-24"
                            />
                        </div>

                        <h2 className="mb-6 text-[22px] font-bold uppercase text-[#2f4053]">
                            SUPER ADMIN
                        </h2>

                        {error && (
                            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-red-500">
                                {error}
                            </div>
                        )}

                        <div className="max-w-[420px]">
                            <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                Security
                            </h3>

                            <div className="space-y-4">
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    placeholder="Old Password"
                                    className="h-10 w-full rounded border px-3"
                                />

                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="New Password"
                                    className="h-10 w-full rounded border px-3"
                                />

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="h-10 w-full rounded border px-3"
                                />

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-md bg-[#f2cc0c] px-6 py-2.5 text-[14px] font-semibold text-white"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditSuperAdminPasswordPage;