// ─────────────────────────────────────────────
// COMPOSANT – TooltipArrow
// Petite flèche triangulaire en bas d'un tooltip
// Usage : <TooltipArrow color="#2d3a6e" />
// ─────────────────────────────────────────────

interface TooltipArrowProps {
  color?: string; 
  size?: number;  
}

export default function TooltipArrow({
  color = "#2d3a6e",
  size = 8,
}: TooltipArrowProps) {
  return (
    <div className="flex justify-center">
      <div
        className="w-0 h-0"
        style={{
          borderLeft: `${size}px solid transparent`,
          borderRight: `${size}px solid transparent`,
          borderTop: `${size}px solid ${color}`,
        }}
      />
    </div>
  );
}