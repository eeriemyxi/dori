export function Modal({
  visibility,
  children,
  onUnboundClick,
}: {
  visibility: boolean;
  children?: React.ReactNode;
  onUnboundClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  if (!visibility) return null;

  return (
    <div
      onClick={onUnboundClick}
      className={
        (visibility ? "visible" : "hidden") +
        " fixed inset-0 flex items-end pb-6 lg:items-center justify-center bg-accent/30 z-50 backdrop-brightness-110 backdrop-blur-xs"
      }
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-bg w-[90%] lg:w-[80%] h-[70%] rounded-3xl border-3 border-border shadow-sm"
      >
        {children}
      </div>
    </div>
  );
}
