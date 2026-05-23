import React from "react";

const CoachesTableHeader: React.FC = () => {
    return (
        <div className="grid min-w-[980px] grid-cols-[40px_1fr_1fr_1.4fr_0.8fr_1fr_1fr] items-center border-b border-[#d9d9d9] px-3 py-4 text-[13px] text-[#4b5563]">
            <div />
            <div>First name</div>
            <div>Second name</div>
            <div className="font-semibold text-[#f4b400]">Email ^</div>
            <div>Civility</div>
            <div>Speciality</div>
            <div />
        </div>
    );
};

export default CoachesTableHeader;