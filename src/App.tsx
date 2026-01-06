import { useMemo, useState } from "react";
import "./App.css";

interface CalendarData {
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

function isLeap(n: number) {
  return n % 400 == 0 || (n % 4 == 0 && n % 100 != 0);
}

function getCalendarData(year?: number): CalendarData[] {
  year = year ?? new Date().getFullYear();
  const calendar: CalendarData[] = Array.from({ length: 12 }, (_) => ({
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
  bgColor = bgColor ?? `${index ? "bg-blue-500" : "bg-gray-500"}`;
  return (
    <button className={`${bgColor} text-white p-2 px-3 rounded`}>
      {index ?? "<>"}
    </button>
  );
}

// function CalendarRow({ cells }) {
//   return <div className="flex gap-3">{cells}</div>;
// }

function CalendarView({ month, year }: { month?: number; year?: number }) {
  const calendarData = useMemo(() => getCalendarData(year), [year]);
  const data = calendarData[month ?? (new Date()).getMonth()];
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

  return (
    <div className="border-3 border-indigo-500 p-3 grid grid-cols-7 gap-3">
      {DAY_NAMES.map((d) => (
        <CalendarCell bgColor="bg-blue-900" index={d} />
      ))}
      {days}
    </div>
  );
}

function App(props: object) {
  const [year, setYear] = useState((new Date()).getFullYear());
  const [month, setMonth] = useState(0);

  return (
    <div {...props}>
      <CalendarView month={month} year={year} />
      <label>Current month: {month + 1}</label>
      <br />
      <label>Current year: {year}</label>
      <br />
      <button onClick={() => setMonth((prev) => (prev + 1) % 12)}>Next month</button>
      <button onClick={() => setMonth((prev) => (((prev - 1) % 12) + 12) % 12)}>Prev month</button>
      <br />
      <button onClick={() => setYear((prev) => prev + 1)}>Next year</button>
      <button onClick={() => setYear((prev) => prev - 1)}>Prev year</button>
    </div>
  );
}

export default App;
