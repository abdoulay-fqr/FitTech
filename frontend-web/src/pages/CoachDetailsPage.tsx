import React, { useEffect, useState } from "react";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/avatar1.png";
import { coachService } from "../services/coachService";
import type { Coach } from "../types/coach";

type Props = {
    onLogout: () => void;
};

const CoachDetailsPage: React.FC<Props> = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [coach, setCoach] = useState<Coach | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCoach = async () => {
            try {
                if (!id) return;
                setLoading(true);
                setError("");
                const data = await coachService.getCoachById(id);
                setCoach(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load coach");
            } finally {
                setLoading(false);
            }
        };

        fetchCoach();
    }, [id]);

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
                            <button onClick={() => navigate("/admin/coaches")} className="text-[#2f4053]">
                                <ArrowLeft size={18} strokeWidth={2.2} />
                            </button>
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">Coach Details</h1>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="relative hidden md:block">
                                <Search
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                                />
                                <input
                                    type="text"
                                    placeholder="Search for coachs"
                                    className="h-10 w-[240px] rounded-md bg-[#f5f5f5] pl-9 pr-3 text-[12px] outline-none"
                                />
                            </div>

                            <button className="flex items-center gap-2 text-[13px] text-[#2f4053]">
                                <Bell size={15} />
                                <span>Notifications</span>
                            </button>
                        </div>
                    </div>

                    <div className="h-[125px] w-full overflow-hidden md:h-[145px]">
                        <img src={cover} alt="Gym cover" className="h-full w-full object-cover" />
                    </div>

                    <div className="px-4 pb-10 md:px-8">
                        <div className="-mt-12 mb-5 md:-mt-14">
                            <img
                                src={coach.profilePic || fallbackAvatar}
                                alt={coach.firstName}
                                className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md md:h-24 md:w-24"
                            />
                        </div>

                        <h2 className="mb-6 text-[22px] font-bold text-[#2f4053]">
                            {coach.firstName} {coach.secondName}
                        </h2>

                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                            <div>
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Personal Information
                                </h3>

                                <div className="space-y-2 text-[12px] text-[#111827]">
                                    <div className="grid grid-cols-[110px_1fr] gap-3">
                                        <span>Phone Number</span>
                                        <span>{coach.phone}</span>
                                    </div>
                                    <div className="grid grid-cols-[110px_1fr] gap-3">
                                        <span>Date of Birth</span>
                                        <span>{coach.birthDate}</span>
                                    </div>
                                    <div className="grid grid-cols-[110px_1fr] gap-3">
                                        <span>Gender</span>
                                        <span>{coach.gender === "MALE" ? "Man" : "Woman"}</span>
                                    </div>
                                </div>

                                <h3 className="mb-4 mt-8 text-[15px] font-semibold text-[#111827]">
                                    Professional Profile
                                </h3>

                                <div className="space-y-3 text-[12px] text-[#111827]">
                                    <div className="grid grid-cols-[110px_1fr] gap-3">
                                        <span>Speciality</span>
                                        <span>{coach.specialties}</span>
                                    </div>
                                    <div className="grid grid-cols-[110px_1fr] gap-3">
                                        <span>Biography</span>
                                        <p className="leading-6">{coach.biography}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Classes Overview
                                </h3>

                                <div className="space-y-2 text-[12px] text-[#111827]">
                                    <div className="text-[#6b7280]">No classes data from backend yet.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CoachDetailsPage;