import React from "react";
import { CircleAlert, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Coach } from "../../../types/coach";
import fallbackAvatar from "../../../assets/avatar1.png";

type CoachRowProps = {
    coach: Coach;
};

const CoachRow: React.FC<CoachRowProps> = ({ coach }) => {
    const navigate = useNavigate();

    return (
        <div
            className="grid min-w-[760px] grid-cols-[34px_0.85fr_0.95fr_1fr_0.7fr_1.2fr_0.95fr]
      items-center border-b border-[#dddddd] px-2 py-2 text-[11px] text-[#3d4654]
      sm:min-w-[860px] sm:grid-cols-[36px_0.9fr_1fr_1.1fr_0.75fr_1.3fr_1fr] sm:px-2.5 sm:text-[12px]
      lg:min-w-[980px] lg:grid-cols-[40px_0.95fr_1.05fr_1.15fr_0.8fr_1.35fr_1fr] lg:px-3 lg:text-[13px]"
        >
            <div className="mr-2 flex items-center">
                <img
                    src={coach.profilePic || fallbackAvatar}
                    alt={coach.firstName}
                    className="h-6 w-6 rounded-full object-cover shadow-[0_2px_8px_rgba(0,0,0,0.18)] sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                />
            </div>

            <div className="uppercase tracking-[0.2px]">{coach.firstName}</div>
            <div>{coach.secondName}</div>
            <div>{coach.phone}</div>
            <div>{coach.gender === "MALE" ? "Man" : "Woman"}</div>
            <div className="truncate">{coach.specialties}</div>

            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2">
                <button
                    onClick={() => navigate(`/admin/coaches/${coach.id}`)}
                    className="flex items-center gap-1 font-semibold text-[#3d4654] transition hover:opacity-80 sm:gap-1.5"
                >
                    <CircleAlert size={14} strokeWidth={1.9} className="sm:size-[15px] lg:size-4" />
                    <span>Details</span>
                </button>

                <button
                    onClick={() => navigate(`/admin/coaches/${coach.id}/edit`)}
                    className="flex items-center gap-1 font-semibold text-[#3d4654] transition hover:opacity-80 sm:gap-1.5"
                >
                    <SquarePen size={14} strokeWidth={1.9} className="sm:size-[15px] lg:size-4" />
                    <span>Edit</span>
                </button>
            </div>
        </div>
    );
};

export default CoachRow;