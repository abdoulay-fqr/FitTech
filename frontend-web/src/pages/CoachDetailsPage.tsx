import React, { useEffect, useState } from "react";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/avatar1.png";
import { coachService } from "../services/coachService";
import type { Coach, CoachClass } from "../types/coach";

type Props = {
    onLogout: () => void;
};

const CoachDetailsPage: React.FC<Props> = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [coach, setCoach] = useState<Coach | null>(null);
    const [classes, setClasses] = useState<CoachClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getImageSrc = (coachId: string, profilePic: string | null) => {
        if (!profilePic) return fallbackAvatar;
        return `http://localhost:8080/users/files/coaches/${coachId}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;

                const [coachData, classesData] = await Promise.all([
                    coachService.getCoachById(id),
                    coachService.getCoachClasses(id),
                ]);

                setCoach(coachData);
                setClasses(classesData);
            } catch (err: any) {
                setError(err.response?.data || err.message || "Failed to load coach");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="p-6">Loading coach...</div>;
    if (!coach) return <div className="p-6 text-red-500">{error || "Coach not found"}</div>;

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
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">Coach Details</h1>
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

                    <div className="h-[130px] w-full overflow-hidden">
                        <img src={cover} alt="cover" className="h-full w-full object-cover" />
                    </div>

                    <div className="px-6 pb-10">
                        <div className="-mt-12 mb-6">
                            <img
                                src={getImageSrc(coach.id, coach.profilePic)}
                                alt={`${coach.firstName} ${coach.secondName}`}
                                onError={(e) => {
                                    e.currentTarget.src = fallbackAvatar;
                                }}
                                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
                            />
                        </div>

                        <h2 className="mb-6 text-[22px] font-bold text-[#2f4053]">
                            {coach.firstName} {coach.secondName}
                        </h2>

                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                            <div>
                                <h3 className="mb-4 font-semibold">Personal Information</h3>

                                <div className="space-y-2 text-[13px]">
                                    <div className="grid grid-cols-[140px_1fr]">
                                        <span>Phone Number</span>
                                        <span>{coach.phone}</span>
                                    </div>

                                    <div className="grid grid-cols-[140px_1fr]">
                                        <span>Date of Birth</span>
                                        <span>{coach.birthDate}</span>
                                    </div>

                                    <div className="grid grid-cols-[140px_1fr]">
                                        <span>Civility</span>
                                        <span>{coach.gender === "MALE" ? "Man" : "Woman"}</span>
                                    </div>
                                </div>

                                <h3 className="mb-4 mt-8 font-semibold">Professional Profile</h3>

                                <div className="space-y-3 text-[13px]">
                                    <div className="grid grid-cols-[140px_1fr]">
                                        <span>Speciality</span>
                                        <span>{coach.specialties}</span>
                                    </div>

                                    <div className="grid grid-cols-[140px_1fr]">
                                        <span>Biography</span>
                                        <p>{coach.biography}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 font-semibold">Classes Overview</h3>

                                <div className="space-y-2 text-[13px]">
                                    {classes.length === 0 ? (
                                        <p>No classes found</p>
                                    ) : (
                                        classes.map((item, index) => (
                                            <div
                                                key={item.id || index}
                                                className="grid grid-cols-[80px_1fr] gap-3"
                                            >
                                                <span>{`Class ${String(index + 1).padStart(2, "0")}`}</span>
                                                <span>{`${item.dayOfWeek}, ${item.startTime}-${item.endTime}`}</span>
                                            </div>
                                        ))
                                    )}
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