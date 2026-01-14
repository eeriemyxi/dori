import { useMemo, useState } from "react";

import { BsDot } from "react-icons/bs";
import { FaGoogleDrive } from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";
import { IoMdConstruct } from "react-icons/io";

import { Modal } from "@/components/Modal/";
import { isLeap, mod } from "@/utils";

import { CalendarCell, MONTH_NAMES } from ".";
import type { CalendarMonth, DateKey, MarkType } from "./types";

export function getDateKey(date: Date): DateKey {
  return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
}

export function getCalendarData(year?: number): CalendarMonth[] {
  year = year ?? new Date().getFullYear();
  const calendar: CalendarMonth[] = Array.from({ length: 12 }, (_) => ({
    days: [],
    weekday: 0,
  }));
  for (let i = 1; i <= 365 + Number(isLeap(year)); i++) {
    const date = new Date(year, 0, i);
    calendar[date.getMonth()].days.push(new Date(date));
    date.setDate(1);
    calendar[date.getMonth()].weekday = date.getDay();
  }
  return calendar;
}

export function Calendar({
  month,
  year,
  marks,
  onDateClick,
  navItems,
}: {
  month: number;
  year: number;
  marks: Record<DateKey, MarkType>;
  onDateClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    dateKey?: DateKey,
  ) => void;
  navItems?: React.ReactNode[];
}) {
  const [{ month: curMonth, year: curYear }, setDate] = useState(() => ({
    month: month,
    year: year,
  }));

  const calendarData = useMemo(() => getCalendarData(curYear), [curYear]);
  const data = calendarData[mod(curMonth, calendarData.length)];

  const days = useMemo(
    () => [
      ...Array.from({ length: data.weekday }, (_, i) => (
        <CalendarCell text="" key={`unused-a-${i}`} mark="inactive" />
      )),
      ...data.days.map((d) => (
        <CalendarCell
          key={getDateKey(d)}
          text={d.getDate()}
          dateKey={getDateKey(d)}
          mark={marks[getDateKey(d)]}
          onClick={onDateClick}
        />
      )),
      ...Array.from(
        { length: 7 * 6 - (data.weekday + data.days.length) },
        (_, i) => (
          <CalendarCell text="" key={`unused-b-${i}`} mark="inactive" />
        ),
      ),
    ],
    [data, marks],
  );

  function updateDate(operation: "plus" | "minus") {
    setDate(({ month, year }) => {
      const nextMonth = operation == "plus" ? month + 1 : month - 1;
      const nextYear = year;
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
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
          <div className="bg-border text-text-primary px-4 py-2 rounded-full text-sm flex items-center select-none font-medium">
            {curYear}
            <BsDot />
            {MONTH_NAMES.at(curMonth)}
          </div>
          {navItems && [...navItems]}
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
    </div>
  );
}
