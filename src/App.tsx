import { useMemo, useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { BsDot } from "react-icons/bs";
import { IoMdConstruct } from "react-icons/io";

import "./App.css";

interface CalendarMonth {
  days: Date[];
  weekday: number;
}

const DAY_NAMES: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function isLeap(n: number) {
  return n % 400 == 0 || (n % 4 == 0 && n % 100 != 0);
}

function getCalendarData(year?: number): CalendarMonth[] {
  year = year ?? new Date().getFullYear();
  const calendar: CalendarMonth[] = Array.from({ length: 12 }, (_) => ({
    days: [],
    weekday: 0,
  }));
  for (var i = 1; i <= 365 + Number(isLeap(year)); i++) {
    var date = new Date(year, 0, i);
    calendar[date.getMonth()].days.push(new Date(date));
    date.setDate(1);
    calendar[date.getMonth()].weekday = date.getDay();
  }
  return calendar;
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function getDateKey(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
}

function CalendarCell({
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

function ModalView({
  visibility,
  setVisibility,
  children,
  ...props
}: {
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}) {
  if (!visibility) return null;

  return (
    <div
      {...props}
      onClick={() => setVisibility((prev) => !prev)}
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

function CalendarView({
  month,
  year,
}: {
  month?: number;
  year?: number;
  markToday?: boolean;
}) {
  const [{ month: curMonth, year: curYear }, setDate] = useState(() => ({
    month: month ?? new Date().getMonth(),
    year: year ?? new Date().getFullYear(),
  }));

  const [modalVisibility, setModalVisibility] = useState(false);
  const [marks, setMarks] = useState<Set<string>>(new Set());

  const calendarData = useMemo(() => getCalendarData(curYear), [curYear]);
  const data = calendarData[mod(curMonth, calendarData.length)];
  var days = useMemo(
    () => [
      ...Array.from({ length: data.weekday }, (_, i) => (
        <CalendarCell key={`unused-a-${i}`} />
      )),
      ...data.days.map((d) => (
        <CalendarCell
          key={getDateKey(d)}
          index={d.getDate()}
          mark={marks.has(getDateKey(d))}
          isToday={getDateKey(d) === getDateKey(new Date())}
          onClick={() => {
            setModalVisibility((prev) => !prev);
            setMarks((prev) => {
              const next = new Set(prev);
              const key: string = getDateKey(d);
              if (next.has(key)) {
                next.delete(key);
              } else {
                next.add(key);
              }
              return next;
            });
          }}
        />
      )),
      ...Array.from(
        { length: 7 * 6 - (data.weekday + data.days.length) },
        (_, i) => <CalendarCell key={`unused-b-${i}`} />,
      ),
    ],
    [data, marks],
  );

  function updateDate(operation: "plus" | "minus") {
    setDate(({ month, year }) => {
      var nextMonth = operation == "plus" ? month + 1 : month - 1;
      var nextYear = year;
      if (nextMonth > 11) {
        return { month: 0, year: year + 1 };
      } else if (nextMonth < 0) {
        return { month: 11, year: year - 1 };
      }
      return { month: nextMonth, year: nextYear };
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative border-3 border-border rounded-3xl p-6 py-10 grid grid-cols-7 gap-3">
        {days}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
          <div className="bg-border text-text-primary px-4 py-2 rounded-full text-sm flex items-center select-none font-medium">
            {curYear}
            <BsDot />
            {MONTH_NAMES.at(curMonth)}
          </div>
        </div>
      </div>
      <div className="border-3 border-border w-full h-30 rounded-full flex items-center flex overflow-hidden">
        <div
          onClick={() => updateDate("minus")}
          className="flex-1 flex items-center justify-start cursor-pointer hover:bg-accent/30 active:bg-accent/30 hover:brightness-140 active:brightness-140 px-10 h-full"
        >
          <GrPrevious className="" size={25} />
        </div>
        <div
          onClick={() => updateDate("plus")}
          className="flex-1 flex items-center justify-end cursor-pointer hover:bg-accent/30 active:bg-accent/30 hover:brightness-140 active:brightness-140 px-10 h-full"
        >
          <GrNext className="" size={25} />
        </div>
      </div>
      <ModalView
        visibility={modalVisibility}
        setVisibility={setModalVisibility}
      >
        <div className="w-full h-full flex items-center justify-center py-5 text-3xl font-roboto">
          <div
            onClick={() => setModalVisibility((prev) => !prev)}
            className="cursor-pointer text-center items-center justify-center flex gap-5 bg-accent/80 p-5 rounded-sm text-white border-2 border-border"
          >
            <IoMdConstruct size={30} />
            <h1>A work in progress!</h1>
          </div>
        </div>
      </ModalView>
    </div>
  );
}

function App() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-bg pb-10">
      <div className="flex-1 flex w-full h-full flex-col justify-center text-text-primary items-center gap-2 select-none">
        <h1 className="text-accent font-medium text-5xl">Dori</h1>
        <p className="text-text-inverse rounded-full px-2 py-1 text-sm font-thin">
          Your daily journal
        </p>
      </div>
      <CalendarView />
    </div>
  );
}

export default App;
