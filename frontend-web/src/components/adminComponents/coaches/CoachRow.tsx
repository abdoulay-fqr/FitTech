import React from "react";
import { CircleAlert, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Coach } from "../../../types/coach";
import fallbackAvatar from "../../../assets/noprofil.png";

type Props = {
    coach: Coach;
};

const CoachRow: React.FC<Props> = ({ coach }) => {
    const navigate = useNavigate();

    const getImageSrc = () => {
        if (!coach.profilePic) return fallbackAvatar;
        return `http://localhost:8080/users/files/coaches/${coach.id}`;
    };

    return (
        <div className="grid min-w-[980px] grid-cols-[40px_1fr_1fr_1.4fr_0.8fr_1fr_1fr] items-center border-b border-[#dddddd] px-3 py-3 text-[13px] text-[#3d4654]">
            <div className="mr-2 flex items-center">
                <img
                    src={getImageSrc()}
                    alt={`${coach.firstName} ${coach.secondName}`}
                    onError={(e) => {
                        e.currentTarget.src = fallbackAvatar;
                    }}
                    className="h-8 w-8 rounded-full object-cover shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
                />
            </div>

            <div className="uppercase">{coach.firstName}</div>
            <div>{coach.secondName}</div>
            <div>{`${coach.firstName.toLowerCase()}.${coach.secondName.toLowerCase()}@gmail.com`}</div>
            <div>{coach.gender === "MALE" ? "Man" : "Woman"}</div>
            <div>{coach.specialties || "-"}</div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(`/admin/coaches/${coach.id}`)}
                    className="flex items-center gap-2 font-semibold text-[#374151]"
                >
                    <CircleAlert size={16} />
                    <span>Details</span>
                </button>

                <button
                    onClick={() => navigate(`/admin/coaches/${coach.id}/edit`)}
                    className="flex items-center gap-2 font-semibold text-[#374151]"
                >
                    <SquarePen size={16} />
                    <span>Edit</span>
                </button>
            </div>
        </div>
    );
};

export default CoachRow;