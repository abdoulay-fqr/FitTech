import React, { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CoachesTable from "../components/adminComponents/coaches/CoachesTable";
import { coachService } from "../services/coachService";
import type { Coach } from "../types/coach";

const CoachesPage: React.FC = () => {
    const navigate = useNavigate();
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                setLoading(true);
                const data = await coachService.getAllCoaches();
                setCoaches(data);
            } catch (err: any) {
                setError(err.response?.data || err.message || "Failed to load coaches");
            } finally {
                setLoading(false);
            }
        };

        fetchCoaches();
    }, []);

    return (
        <section className="min-h-screen bg-white px-4 py-4 md:px-7 md:py-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-[#2f4053]">Coachs Management</h1>
                    <p className="mt-5 text-[14px] text-[#111827]">
                        Here you can view, add, edit and manage all your coachs
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
                            placeholder="Search for coachs"
                            className="h-10 w-[275px] rounded-md bg-[#f5f5f5] pl-9 pr-3 text-[12px] outline-none"
                        />
                    </div>

                    <button className="flex items-center gap-2 text-[13px] text-[#2f4053]">
                        <Bell size={15} />
                        <span>Notifications</span>
                    </button>
                </div>
            </div>

            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => navigate("/admin/coaches/new")}
                    className="rounded-md bg-[#f2cc0c] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:opacity-90"
                >
                    Add New Coach
                </button>
            </div>

            {loading && <p>Loading coaches...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && <CoachesTable coaches={coaches} />}
        </section>
    );
};

export default CoachesPage;