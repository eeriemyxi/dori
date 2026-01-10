import { useState, useMemo } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { BsDot } from "react-icons/bs";
import { IoMdConstruct } from "react-icons/io";

import type { CalendarMonth } from ".";
import { CalendarCell, MONTH_NAMES } from ".";
import { Modal } from "@/components/Modal/";
import { isLeap, mod } from "@/utils";

export function getDateKey(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
}

export function getCalendarData(year?: number): CalendarMonth[] {
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

export function Calendar({
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
      <Modal visibility={modalVisibility} setVisibility={setModalVisibility}>
        <div className="w-full h-full flex items-center justify-center py-5 text-3xl font-roboto">
          <div
            onClick={() => setModalVisibility((prev) => !prev)}
            className="cursor-pointer text-center items-center justify-center flex gap-5 bg-accent/80 p-5 rounded-sm text-white border-2 border-border"
          >
            <IoMdConstruct size={30} />
            <h1>A work in progress!</h1>
          </div>
        </div>
      </Modal>
    </div>
  );
}
