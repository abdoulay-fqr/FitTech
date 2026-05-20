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

const SuperAdminSettingsPage: React.FC<Props> = ({ onLogout }) => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const getProfileImageSrc = (adminId: string, profilePic: string | null) => {
        if (!profilePic) return fallbackAvatar;
        return `http://localhost:8080/users/files/admins/${adminId}`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await adminService.getMyProfile();
                setAdmin(data);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="p-6">Loading profile...</div>;
    if (!admin) return <div className="p-6 text-red-500">Failed to load profile</div>;

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex items-center justify-between border-b border-[#ececec] px-4 py-5 md:px-7">
                        <h1 className="text-[18px] font-semibold text-[#2f4053]">Settings</h1>

                        <button className="flex items-center gap-2 text-[13px] text-[#2f4053]">
                            <Bell size={15} />
                            <span>Notifications</span>
                        </button>
                    </div>

                    <div className="h-[125px] w-full overflow-hidden md:h-[145px]">
                        <img src={cover} alt="Gym cover" className="h-full w-full object-cover" />
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
                            <h2 className="text-[22px] font-bold uppercase text-[#2f4053]">
                                SUPER ADMIN
                            </h2>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate("/super-admin/admins")}
                                    className="rounded-md border border-[#f2cc0c] px-5 py-2.5 text-[14px] font-semibold text-[#f2cc0c]"
                                >
                                    Show Admins
                                </button>

                                <button
                                    onClick={() => navigate("/super-admin/settings/password")}
                                    className="rounded-md bg-[#f2cc0c] px-5 py-2.5 text-[14px] font-semibold text-white"
                                >
                                    Edit Password
                                </button>
                            </div>
                        </div>

                        <div className="max-w-[420px]">
                            <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                Personal Information
                            </h3>

                            <div className="space-y-2 text-[12px] text-[#111827]">
                                <div className="grid grid-cols-[110px_1fr] gap-3">
                                    <span>Email</span>
                                    <span>{admin.email || "admin@example.com"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminSettingsPage;