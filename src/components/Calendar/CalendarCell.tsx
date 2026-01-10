import type { DateKey, MarkType } from "./types";

export function CalendarCell({
  text,
  dateKey,
  onClick,
  mark = "normal",
}: {
  text: string | number;
  dateKey?: DateKey;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>, dateKey?: DateKey) => void;
  mark?: MarkType;
}) {
  var common =
    "w-9 h-9 lg:w-15 lg:h-15 text-center rounded-full transition select-none font-oswald";

  var markStyle = "";
  if (mark == "normal") {
    markStyle =
      "border-border hover:bg-accent active:bg-accent hover:text-bg active:text-bg hover:border-accent active:border-accent hover:brightness-120 active:brightness-120 border-2 cursor-pointer";
  } else if (mark == "today") {
    markStyle =
      "bg-border border-border text-text-primary hover:bg-accent active:bg-accent hover:text-bg active:text-bg hover:border-accent active:border-accent hover:brightness-120 active:brightness-120 border-2 cursor-pointer";
  } else if (mark == "green") {
    markStyle =
      "bg-accent border-accent text-text-primary hover:brightness-120 active:brightness-120 border-2 cursor-pointer";
  } else if (mark == "inactive") {
    markStyle = "bg-accent/15 brightness-40 ";
  }

  return (
    <button
      onClick={(e) => onClick && onClick(e, dateKey)}
      className={`${common} ${markStyle}`}
    >
      {text}
    </button>
  );
}
