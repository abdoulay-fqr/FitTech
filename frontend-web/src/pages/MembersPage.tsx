import React, { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MembersTable from "../components/adminComponents/members/MembersTable";
import { memberService } from "../services/memberService";
import type { Member } from "../types/member";

const MembersPage: React.FC = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await memberService.getAllMembers();
        setMembers(data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data || err.message || "Error while loading members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
      <section className="min-h-screen bg-white px-4 py-4 md:px-7 md:py-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#2f4053]">Members Management</h1>
            <p className="mt-5 text-[14px] text-[#111827]">
              Here you can view, add, edit and manage all your members
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
                  placeholder="Search for members"
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
              onClick={() => navigate("/admin/members/new")}
              className="rounded-md bg-[#f2cc0c] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:opacity-90"
          >
            Add New Member
          </button>
        </div>

        {loading && <p className="text-[14px] text-[#374151]">Loading members...</p>}
        {error && <p className="text-[14px] text-red-500">{error}</p>}
        {!loading && !error && <MembersTable members={members} />}
      </section>
  );
};

export default MembersPage;