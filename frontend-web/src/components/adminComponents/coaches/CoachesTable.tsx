import React from "react";
import type { Coach } from "../../../types/coach";
import CoachesTableHeader from "./CoachesTableHeader";
import CoachRow from "./CoachRow";

type Props = {
    coaches: Coach[];
};

const CoachesTable: React.FC<Props> = ({ coaches }) => {
    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-full">
                <CoachesTableHeader />
                {coaches.map((coach) => (
                    <CoachRow key={coach.id} coach={coach} />
                ))}
            </div>
        </div>
    );
};

export default CoachesTable;