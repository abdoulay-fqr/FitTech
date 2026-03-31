import React, { useEffect, useState } from "react";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/avatar1.png";
import { memberService } from "../services/memberService";
import type { Member } from "../types/member";

type Props = {
  onLogout: () => void;
};

const MemberDetailsPage: React.FC<Props> = ({ onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        if (!id) return;

        setLoading(true);
        const data = await memberService.getMemberById(id);
        setMember(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load member");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading member...</div>;
  }

  if (error || !member) {
    return <div className="p-6 text-red-500">Member not found</div>;
  }

  return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Sidebar onLogout={onLogout} />

        <main className="pt-14 md:ml-[156px] md:pt-0">
          <div className="min-h-screen bg-white">
            {/* HEADER */}
            <div className="flex flex-col gap-4 border-b border-[#ececec] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
              <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate("/admin/home")}
                    className="text-[#2f4053]"
                >
                  <ArrowLeft size={18} />
                </button>

                <h1 className="text-[18px] font-semibold text-[#2f4053]">
                  Member Details
                </h1>
              </div>

              <div className="flex items-center gap-5">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                  <input
                      type="text"
                      placeholder="Search"
                      className="h-10 w-[240px] rounded-md bg-[#f5f5f5] pl-9 pr-3 text-[12px]"
                  />
                </div>

                <button className="flex items-center gap-2 text-[13px]">
                  <Bell size={15} />
                  Notifications
                </button>
              </div>
            </div>

            {/* COVER */}
            <div className="h-[130px] w-full overflow-hidden">
              <img src={cover} className="h-full w-full object-cover" />
            </div>

            <div className="px-6 pb-10">
              {/* AVATAR */}
              <div className="-mt-12 mb-6">
                <img
                    src={member.profilePic || fallbackAvatar}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
                />
              </div>

              {/* NAME */}
              <h2 className="mb-6 text-[22px] font-bold">
                {member.firstName} {member.secondName}
              </h2>

              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* LEFT */}
                <div>
                  <h3 className="mb-4 font-semibold">Personal Information</h3>

                  <div className="space-y-2 text-[13px]">
                    <div className="grid grid-cols-[140px_1fr]">
                      <span>Phone</span>
                      <span>{member.phone}</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr]">
                      <span>Birth Date</span>
                      <span>{member.birthDate}</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr]">
                      <span>Gender</span>
                      <span>
                      {member.gender === "MALE" ? "Man" : "Woman"}
                    </span>
                    </div>
                  </div>

                  <h3 className="mb-4 mt-8 font-semibold">Health Profile</h3>

                  <div className="space-y-3 text-[13px]">
                    <div>
                      <span className="font-medium">Objective</span>
                      <p>{member.objective}</p>
                    </div>

                    <div>
                      <span className="font-medium">Medical Restrictions</span>
                      <p>{member.medicalRestrictions}</p>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div>
                  <h3 className="mb-4 font-semibold">Membership</h3>

                  <div className="space-y-2 text-[13px]">
                    <div className="grid grid-cols-[140px_1fr]">
                      <span>Plan</span>
                      <span>{member.subscriptionPlan}</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr]">
                      <span>Status</span>
                      <span>{member.subscriptionStatus}</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr]">
                      <span>NFC Card</span>
                      <span>{member.nfcCardId}</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr]">
                      <span>NFC Active</span>
                      <span>{member.nfcActive ? "Yes" : "No"}</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr]">
                      <span>Suspended</span>
                      <span>{member.suspended ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default MemberDetailsPage;