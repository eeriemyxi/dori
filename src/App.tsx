import { useMemo, useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { BsDot } from "react-icons/bs";

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

function CalendarCell({
  bgColor,
  index,
}: {
  bgColor?: string;
  index?: string | number;
}) {
  bgColor =
    bgColor ?? `${index ? "bg-[#6d9886] hover:brightness-120 cursor-pointer" : "bg-[#6d9886]/15 brightness-40"}`;
  return (
    <button
      className={`${bgColor} text-white w-15 h-15 text-center rounded-full transition select-none`}
    >
      {index ?? ""}
    </button>
  );
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function CalendarView({ month, year }: { month?: number; year?: number }) {
  const [{ month: curMonth, year: curYear }, setDate] = useState(() => ({
    month: month ?? new Date().getMonth(),
    year: year ?? new Date().getFullYear(),
  }));

  const calendarData = useMemo(() => getCalendarData(year), [curYear]);
  const data = calendarData[mod(curMonth, calendarData.length)];
  var days = useMemo(
    () => [
      ...Array.from({ length: data.weekday }, (_) => <CalendarCell />),
      ...data.days.map((d) => <CalendarCell index={d.getDate()} />),
      ...Array.from(
        { length: 7 * 6 - (data.weekday + data.days.length) },
        (_) => <CalendarCell />,
      ),
    ],
    [data],
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
      <div className="relative border-3 border-[#393e46] rounded-3xl p-6 py-10 grid grid-cols-7 gap-3">
        {days}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
          <div className="bg-[#393e46] text-[#f7f7f7] px-4 py-2 rounded-full text-sm flex items-center select-none font-medium">
            {curYear}
            <BsDot />
            {MONTH_NAMES.at(curMonth)}
          </div>
        </div>
      </div>
      <div className="border-3 border-[#393e46] w-full h-30 rounded-full flex items-center flex overflow-hidden">
        <div
          onClick={() => updateDate("minus")}
          className="flex-1 flex items-center justify-start cursor-pointer hover:bg-[#6d9886]/15 hover:brightness-40 px-10 h-full"
        >
          <GrPrevious className="" size={25} />
        </div>
        <div
          onClick={() => updateDate("plus")}
          className="flex-1 flex items-center justify-end cursor-pointer hover:bg-[#6d9886]/15 hover:brightness-40 px-10 h-full"
        >
          <GrNext className="" size={25} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#f7f7f7] p-20">
      <div className="flex-1 flex flex-col justify-start text-[#393e46] items-center gap-2 select-none">
        <h1 className="text-[#6d9886] font-medium text-5xl">Dori</h1>
        <p className="text-[#393e46] rounded-full px-2 py-1 text-sm font-thin">
          Your daily journal
        </p>
      </div>
      <CalendarView />
    </div>
  );
}

export default App;
