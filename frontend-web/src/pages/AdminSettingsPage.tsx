import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/noprofil.png";
import { adminService } from "../services/adminService";
import type { AdminProfile } from "../types/admin";

type Props = {
    onLogout: () => void;
};

const IMAGE_BASE_URL = "http://localhost:8080/uploads";

const AdminSettingsPage: React.FC<Props> = ({ onLogout }) => {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getProfileImageSrc = (adminId: string, profilePic: string | null) => {
        if (!profilePic) return fallbackAvatar;
        return `http://localhost:8080/users/files/admins/${adminId}`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await adminService.getMyProfile();
                setAdmin(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load admin profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="p-6">Loading profile...</div>;
    }

    if (error || !admin) {
        return <div className="p-6 text-red-500">Failed to load profile</div>;
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex items-center justify-between border-b border-[#ececec] px-4 py-5 md:px-7">
                        <h1 className="text-[18px] font-semibold text-[#2f4053]">
                            Settings
                        </h1>

                        <button className="flex items-center gap-2 text-[13px] text-[#2f4053]">
                            <Bell size={15} />
                            <span>Notifications</span>
                        </button>
                    </div>

                    <div className="h-[125px] w-full overflow-hidden md:h-[145px]">
                        <img
                            src={cover}
                            alt="Gym cover"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="px-5 pb-10 md:px-7">
                        <div className="-mt-12 mb-5 md:-mt-14">
                            <img
                                src={getProfileImageSrc(admin.id, admin.profilePic)}
                                alt={`${admin.firstName} ${admin.secondName}`}
                                onError={(e) => {
                                    e.currentTarget.src = fallbackAvatar;
                                }}
                                className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md md:h-24 md:w-24"
                            />
                        </div>

                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <h2 className="text-[22px] font-bold text-[#2f4053]">
                                {admin.firstName} {admin.secondName}
                            </h2>

                            <button
                                onClick={() => navigate("/admin/settings/edit")}
                                className="w-fit rounded-md bg-[#f2cc0c] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:opacity-90"
                            >
                                Edit Information
                            </button>
                        </div>

                        <div className="max-w-[420px]">
                            <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                Personal Information
                            </h3>

                            <div className="space-y-2 text-[12px] text-[#111827]">
                                <div className="grid grid-cols-[110px_1fr] gap-3">
                                    <span>Email</span>
                                    <span>Not available</span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr] gap-3">
                                    <span>Phone Number</span>
                                    <span>{admin.phone}</span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr] gap-3">
                                    <span>Date of Birth</span>
                                    <span>{admin.birthDate}</span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr] gap-3">
                                    <span>Civility</span>
                                    <span>{admin.gender === "MALE" ? "Man" : "Woman"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSettingsPage;