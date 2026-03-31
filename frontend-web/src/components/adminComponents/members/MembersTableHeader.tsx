import React from "react";

const MembersTableHeader: React.FC = () => {
  return (
      <div
          className="grid min-w-[760px] grid-cols-[34px_0.9fr_1fr_1.1fr_0.75fr_1fr_1fr]
      items-center border-b border-[#d9d9d9] px-2 py-3 text-[11px] text-[#4b5563]
      sm:min-w-[860px] sm:grid-cols-[36px_0.95fr_1fr_1.15fr_0.8fr_1.05fr_1fr] sm:px-2.5 sm:text-[12px]
      lg:min-w-[980px] lg:grid-cols-[40px_1fr_1.05fr_1.2fr_0.85fr_1.1fr_1fr] lg:px-3 lg:py-4 lg:text-[13px]"
      >
        <div />
        <div>First name</div>
        <div>Second name</div>
        <div className="font-semibold text-[#f4b400]">Phone ^</div>
        <div>Gender</div>
        <div>Plan</div>
        <div />
      </div>
  );
};

export default MembersTableHeader;