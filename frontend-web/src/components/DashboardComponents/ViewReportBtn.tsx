interface ViewReportBtnProps {
  onClick?: () => void;
}
 
export default function ViewReportBtn({ onClick }: ViewReportBtnProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs border border-[#2d3a6e] text-[#2d3a6e] rounded-lg hover:bg-[#2d3a6e] hover:text-white transition-colors font-medium whitespace-nowrap shrink-0"
    >
      View Report
    </button>
  );
}