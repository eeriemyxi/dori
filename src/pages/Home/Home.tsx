import { useState, useEffect, useMemo } from "react";
import type { DateKey, MarkType } from "@/components/Calendar";
import { Calendar, getDateKey } from "@/components/Calendar";
import { Modal } from "@/components/Modal";
import { GDRIVE_CLIENT_ID, REDIRECT_URI } from "@/constants";

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
      />
      <Modal
        visibility={activeDate !== null}
        onUnboundClick={() => setActiveDate(null)}
      >
        <div className="w-full h-full flex items-center justify-center py-5 text-3xl font-roboto">
          <div
            onClick={async () => {
              const verifier = crypto.randomUUID();
              sessionStorage.setItem("pkce-verifier", verifier);

              const encoder = new TextEncoder();
              const data = encoder.encode(verifier);
              const digest = await crypto.subtle.digest("SHA-256", data);
              const challenge = btoa(
                String.fromCharCode(...new Uint8Array(digest)),
              )
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=+$/, "");
              const authUrl =
                "https://accounts.google.com/o/oauth2/v2/auth?" +
                new URLSearchParams({
                  client_id: GDRIVE_CLIENT_ID,
                  redirect_uri: REDIRECT_URI,
                  response_type: "code",
                  scope: "https://www.googleapis.com/auth/drive.appdata",
                  access_type: "offline",
                  prompt: "consent",
                  code_challenge: challenge,
                  code_challenge_method: "S256",
                  state: crypto.randomUUID(),
                });
              window.location.href = authUrl;
            }}
            className="cursor-pointer text-center items-center justify-center flex gap-5 bg-accent/80 p-5 rounded-sm text-white border-2 border-border"
          >
            <h1>Sync with Google Drive</h1>
          </div>
        </div>
      </Modal>
      ;
    </div>
  );
}
