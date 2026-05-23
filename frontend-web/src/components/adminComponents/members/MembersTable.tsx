import React from "react";
import type { Member } from "../../../types/member";
import MembersTableHeader from "./MembersTableHeader";
import MemberRow from "./MemberRow";

type MembersTableProps = {
    members: Member[];
};

const MembersTable: React.FC<MembersTableProps> = ({ members }) => {
    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-full bg-transparent">
                <MembersTableHeader />
                <div>
                    {members.map((member) => (
                        <MemberRow key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MembersTable;