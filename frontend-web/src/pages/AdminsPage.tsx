import React, { useEffect, useState } from "react";
import { Bell, Search, CircleAlert, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import fallbackAvatar from "../assets/noprofil.png";
import { adminService } from "../services/adminService";
import type { AdminProfile } from "../types/admin";

type Props = {
    onLogout: () => void;
};

const AdminsPage: React.FC<Props> = ({ onLogout }) => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState<AdminProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const getImageSrc = (adminId: string, profilePic: string | null) => {
        if (!profilePic) return fallbackAvatar;
        return `http://localhost:8080/users/files/admins/${adminId}`;
    };

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const data = await adminService.getAllAdmins();
                setAdmins(data);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="min-h-screen pt-14 md:ml-[156px] md:pt-0">
                <section className="min-h-screen bg-white px-4 py-4 md:px-7 md:py-6">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-[22px] font-bold text-[#2f4053]">Admins Management</h1>
                            <p className="mt-5 text-[14px] text-[#111827]">
                                Here you can view, add, edit and manage all your admins
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block">
                                <Search
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                                />
                                <input
                                    type="text"
                                    placeholder="Search for admins"
                                    className="h-10 w-[275px] rounded-md bg-[#f5f5f5] pl-9 pr-3 text-[12px] outline-none"
                                />
                            </div>

                            <button className="flex items-center gap-2 text-[13px] text-[#2f4053]">
                                <Bell size={15} />
                                <span>Notifications</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 flex justify-end gap-3">
                        <button
                            onClick={() => navigate("/super-admin/settings")}
                            className="rounded-md border border-[#f2cc0c] px-5 py-2.5 text-[14px] font-semibold text-[#f2cc0c]"
                        >
                            Go Back
                        </button>

                        <button
                            onClick={() => navigate("/super-admin/admins/new")}
                            className="rounded-md bg-[#f2cc0c] px-5 py-2.5 text-[14px] font-semibold text-white"
                        >
                            Add New Admin
                        </button>
                    </div>

                    {loading ? (
                        <p>Loading admins...</p>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[980px]">
                                <div className="grid grid-cols-[40px_1fr_1fr_1.4fr_0.8fr_1fr] border-b border-[#d9d9d9] px-3 py-4 text-[13px] text-[#4b5563]">
                                    <div />
                                    <div>First name</div>
                                    <div>Second name</div>
                                    <div className="font-semibold text-[#f4b400]">Email ^</div>
                                    <div>Civility</div>
                                    <div />
                                </div>

                                {admins.map((admin) => (
                                    <div
                                        key={admin.id}
                                        className="grid grid-cols-[40px_1fr_1fr_1.4fr_0.8fr_1fr] items-center border-b border-[#dddddd] px-3 py-3 text-[13px] text-[#3d4654]"
                                    >
                                        <div className="mr-2 flex items-center">
                                            <img
                                                src={getImageSrc(admin.id, admin.profilePic)}
                                                alt={`${admin.firstName} ${admin.secondName}`}
                                                onError={(e) => {
                                                    e.currentTarget.src = fallbackAvatar;
                                                }}
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        </div>

                                        <div className="uppercase">{admin.firstName}</div>
                                        <div>{admin.secondName}</div>
                                        <div>{admin.email || `${admin.firstName}.${admin.secondName}@gmail.com`}</div>
                                        <div>{admin.gender === "MALE" ? "Man" : "Woman"}</div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => navigate(`/super-admin/admins/${admin.id}`)}
                                                className="flex items-center gap-2 font-semibold text-[#374151]"
                                            >
                                                <CircleAlert size={16} />
                                                <span>Details</span>
                                            </button>

                                            <button
                                                onClick={() => navigate(`/super-admin/admins/${admin.id}/edit`)}
                                                className="flex items-center gap-2 font-semibold text-[#374151]"
                                            >
                                                <SquarePen size={16} />
                                                <span>Edit</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default AdminsPage;