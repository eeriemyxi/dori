import {useEffect} from "react"

export function Modal({
  visibility,
  children,
  onUnboundClick,
  onVisible
}: {
  visibility: boolean;
  children?: React.ReactNode;
  onUnboundClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onVisible?: () => void;
}) {
  useEffect(() => {if (visibility) onVisible && onVisible()})

  return (
    <div
      onClick={onUnboundClick}
      className={
        (visibility
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none") +
        " fixed inset-0 flex items-end pb-6 lg:items-center justify-center bg-accent/30 z-50 backdrop-brightness-110 backdrop-blur-xs transition-opacity duration-150"
      }
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-bg w-[90%] lg:w-[80%] h-[70%] rounded-3xl border-3 border-border shadow-sm transition duration-150 ${visibility ? "scale-100" : "scale-95 select-none"}`}
      >
        {children}
      </div>
    </div>
  );
}
