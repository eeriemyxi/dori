import { useState, useEffect, useRef, useMemo } from "react";
import { IoIosSettings } from "react-icons/io";

import {
  Calendar,
  getDateKey,
  type DateKey,
  type MarkType,
} from "@/components/Calendar";

import MarkdownEditorModal from "@/components/MarkdownEditorModal";

export default function Home() {
  const today = useMemo(() => new Date(), []);
  const [marks, setMarks] = useState<Map<DateKey, MarkType>>(
    new Map([[getDateKey(today), "today"]]),
  );

  const [activeDate, setActiveDate] = useState<DateKey | null>(null);
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-bg pb-10">
      <div className="flex-1 flex w-full h-full flex-col justify-center text-text-primary items-center gap-2 select-none">
        <h1 className="text-accent font-medium text-5xl">Dori</h1>
        <p className="text-text-inverse rounded-full px-2 py-1 text-sm font-thin">
          Your daily journal
        </p>
      </div>
      <Calendar
        month={today.getMonth()}
        year={today.getFullYear()}
        marks={marks}
        onDateClick={(_, key) => {
          key && setActiveDate(key);
        }}
        navItems={[<div className="bg-border text-text-primary p-2 rounded-full flex items-center hover:brightness-120 cursor-pointer select-none">
                     <IoIosSettings size={25} />
                   </div>]}
      />
      <MarkdownEditorModal value="# Hello world" visibility={activeDate !== null} onUnboundClick={() => setActiveDate(null)} onSave={(_, text) => {setActiveDate(null)}}/>
    </div>
  );
}
