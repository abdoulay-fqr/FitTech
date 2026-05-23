import React, { useEffect, useState } from "react";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/noprofil.png";
import { adminService } from "../services/adminService";
import type { AdminProfile } from "../types/admin";

type Props = {
    onLogout: () => void;
};

const AdminDetailsPage: React.FC<Props> = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const getProfileImageSrc = (adminId: string, profilePic: string | null) => {
        if (!profilePic) return fallbackAvatar;
        return `http://localhost:8080/users/files/admins/${adminId}`;
    };

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                if (!id) return;
                const data = await adminService.getAdminById(id);
                setAdmin(data);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, [id]);

    if (loading) return <div className="p-6">Loading admin...</div>;
    if (!admin) return <div className="p-6 text-red-500">Admin not found</div>;

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex items-center justify-between border-b px-4 py-5 md:px-7">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate("/super-admin/admins")}>
                                <ArrowLeft size={18} />
                            </button>
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">Admin Details</h1>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                                <input
                                    type="text"
                                    placeholder="Search for admins"
                                    className="h-10 w-[240px] rounded-md bg-[#f5f5f5] pl-9 pr-3 text-[12px]"
                                />
                            </div>

                            <button className="flex items-center gap-2 text-[13px]">
                                <Bell size={15} />
                                Notifications
                            </button>
                        </div>
                    </div>

                    <div className="h-[130px] w-full overflow-hidden">
                        <img src={cover} alt="cover" className="h-full w-full object-cover" />
                    </div>

                    <div className="px-6 pb-10">
                        <div className="-mt-12 mb-6">
                            <img
                                src={getProfileImageSrc(admin.id, admin.profilePic)}
                                alt={`${admin.firstName} ${admin.secondName}`}
                                onError={(e) => {
                                    e.currentTarget.src = fallbackAvatar;
                                }}
                                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
                            />
                        </div>

                        <h2 className="mb-6 text-[22px] font-bold text-[#2f4053]">
                            {admin.firstName} {admin.secondName}
                        </h2>

                        <div className="space-y-2 text-[13px]">
                            <div className="grid grid-cols-[140px_1fr]">
                                <span>Phone Number</span>
                                <span>{admin.phone}</span>
                            </div>

                            <div className="grid grid-cols-[140px_1fr]">
                                <span>Date of Birth</span>
                                <span>{admin.birthDate}</span>
                            </div>

                            <div className="grid grid-cols-[140px_1fr]">
                                <span>Civility</span>
                                <span>{admin.gender === "MALE" ? "Man" : "Woman"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDetailsPage;