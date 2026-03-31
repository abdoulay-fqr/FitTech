import React from "react";
import { CircleAlert, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Member } from "../../../types/member";
import fallbackAvatar from "../../../assets/avatar1.png";

type MemberRowProps = {
  member: Member;
};

const MemberRow: React.FC<MemberRowProps> = ({ member }) => {
  const navigate = useNavigate();

  const planClass =
      member.subscriptionStatus === "EXPIRED"
          ? "text-[#ff2b2b] font-semibold"
          : "text-[#3d4654]";

  return (
      <div
          className="grid min-w-[760px] grid-cols-[34px_0.9fr_1fr_1.1fr_0.75fr_1fr_1fr]
      items-center border-b border-[#dddddd] px-2 py-2 text-[11px] text-[#3d4654]
      sm:min-w-[860px] sm:grid-cols-[36px_0.95fr_1fr_1.15fr_0.8fr_1.05fr_1fr] sm:px-2.5 sm:text-[12px]
      lg:min-w-[980px] lg:grid-cols-[40px_1fr_1.05fr_1.2fr_0.85fr_1.1fr_1fr] lg:px-3 lg:text-[13px]"
      >
        <div className="mr-2 flex items-center">
          <img
              src={member.profilePic || fallbackAvatar}
              alt={member.firstName}
              className="h-6 w-6 rounded-full object-cover shadow-[0_2px_8px_rgba(0,0,0,0.18)] sm:h-7 sm:w-7 lg:h-8 lg:w-8"
          />
        </div>

        <div className="uppercase tracking-[0.2px]">{member.firstName}</div>
        <div>{member.secondName}</div>
        <div>{member.phone}</div>
        <div>{member.gender === "MALE" ? "Man" : "Woman"}</div>
        <div className={planClass}>{member.subscriptionPlan}</div>

        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2">
          <button
              onClick={() => navigate(`/admin/members/${member.id}`)}
              className="flex items-center gap-1 font-semibold text-[#3d4654] transition hover:opacity-80 sm:gap-1.5"
          >
            <CircleAlert size={14} strokeWidth={1.9} className="sm:size-[15px] lg:size-4" />
            <span>Details</span>
          </button>

          <button
              onClick={() => navigate(`/admin/members/${member.id}/edit`)}
              className="flex items-center gap-1 font-semibold text-[#3d4654] transition hover:opacity-80 sm:gap-1.5"
          >
            <SquarePen size={14} strokeWidth={1.9} className="sm:size-[15px] lg:size-4" />
            <span>Edit</span>
          </button>
        </div>
      </div>
  );
};

export default MemberRow;