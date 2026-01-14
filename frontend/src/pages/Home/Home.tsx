import { useEffect, useMemo, useRef, useState } from "react";

import { IoIosSettings } from "react-icons/io";

import {
  Calendar,
  type DateKey,
  type MarkType,
  getDateKey,
} from "@/components/Calendar";
import MarkdownEditorModal from "@/components/MarkdownEditorModal";
import Popover from "@/components/Popover";
import * as persist from "@/utils/persistence";

const DEFAULT_CONTENT =
  "# Sample Content\nYou can double-click or double-tap to edit this content.";

export default function Home() {
  const data = useMemo(() => persist.load_data(), []);
  const today = useMemo(() => new Date(), []);
  const [marks, setMarks] = useState(() => {
    const marks: Record<DateKey, MarkType> = { [getDateKey(today)]: "today" };
    for (const [key, _] of Object.entries(data.notes)) {
      marks[key as DateKey] = "green";
    }
    return marks;
  });
  const [activeDate, setActiveDate] = useState<DateKey | null>(null);
  const [editorValue, setEditorValue] = useState(DEFAULT_CONTENT);

  return (
    <div className="flex flex-col justify-center items-center h-dvh bg-bg pb-10">
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
          if (!key) return;
          setEditorValue(data.notes[key]?.content ?? DEFAULT_CONTENT);
          key && setActiveDate(key);
        }}
        navItems={[
          <Popover
            key="p1"
            trigger={
              <div className="bg-border text-text-primary p-2 rounded-full flex items-center hover:brightness-120 cursor-pointer select-none">
                <IoIosSettings size={25} />
              </div>
            }
          >
            <button onClick={() => window.location.href = "/sign-up"} className="block w-full px-4 py-2 text-left hover:bg-accent/30 active:bg-accent/30 hover:brightness-140 active:brightness-140 cursor-pointer">
              Sign Up
            </button>
            <button className="block w-full px-4 py-2 text-left hover:bg-accent/30 active:bg-accent/30 hover:brightness-140 active:brightness-140 cursor-pointer">
              Settings
            </button>
            <button className="block w-full px-4 py-2 text-left hover:bg-accent/30 active:bg-accent/30 hover:brightness-140 active:brightness-140 cursor-pointer">
              Logout
            </button>
          </Popover>,
        ]}
      />
      <MarkdownEditorModal
        key={activeDate ?? "closed"}
        value={editorValue}
        visibility={activeDate !== null}
        onSave={(_, text) => {
          if (activeDate === null) throw new Error("not possible");
          data.notes[activeDate] = {
            key: activeDate,
            content: text,
            lastModified: Math.floor(Date.now() / 1000),
            version: crypto.randomUUID(),
          };
          setMarks((prev) => {
            return { ...prev, [activeDate]: "green" };
          });
          persist.save_data(data);
          setActiveDate(null);
        }}
        onDelete={(_, __) => {
          if (activeDate === null) throw new Error("not possible");
          delete data.notes[activeDate];
          setMarks((prev) => {
            const mark = activeDate === getDateKey(today) ? "today" : "normal";
            return { ...prev, [activeDate]: mark };
          });
          persist.save_data(data);
          setActiveDate(null);
        }}
        onBack={(_, __) => {
          return setActiveDate(null);
        }}
      />
    </div>
  );
}
