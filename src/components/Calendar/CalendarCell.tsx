export function CalendarCell({
  bgColor,
  index,
  onClick,
  mark = false,
  isToday = false,
}: {
  bgColor?: string;
  index?: string | number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  mark?: boolean;
  isToday?: boolean;
}) {
  bgColor =
    bgColor ??
    `${index ? "hover:brightness-120 active:brightness-120 hover:bg-accent active:bg-accent hover:border-accent hover:text-bg active:border-accent active:text-bg border-2 border-border cursor-pointer" : "bg-accent/15 brightness-40"}`;
  const markStyle = isToday
    ? "brightness-100 bg-border border-border text-text-primary"
    : mark
      ? "brightness-100 bg-accent !border-accent text-text-primary"
      : "";
  return (
    <button
      onClick={onClick}
      className={
        `${bgColor} text-text-inverse w-9 h-9 lg:w-15 lg:h-15 text-center rounded-full transition select-none text-base font-oswald ` +
        markStyle
      }
    >
      {index ?? ""}
    </button>
  );
}
