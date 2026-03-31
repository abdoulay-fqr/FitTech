import React from "react";
import type { Coach } from "../../../types/coach";
import CoachesTableHeader from "./CoachesTableHeader";
import CoachRow from "./CoachRow";

type CoachesTableProps = {
    coaches: Coach[];
};

const CoachesTable: React.FC<CoachesTableProps> = ({ coaches }) => {
    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-full bg-transparent">
                <CoachesTableHeader />
                <div>
                    {coaches.map((coach) => (
                        <CoachRow key={coach.id} coach={coach} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoachesTable;