"use client";

import { useState } from "react";
import { Flag, Send } from "lucide-react";
import { REPORT_CATEGORIES } from "@/lib/constants";
import type { ReportCategory } from "@/lib/types";
import { ActionButton } from "@/components/action-button";

type ReportDialogProps = {
  matchId: string;
  reportedUser: string;
};

export function ReportDialog({ matchId, reportedUser }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ReportCategory>("Fake Kamera");
  const [sent, setSent] = useState(false);

  async function submitReport() {
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, reportedUser, category })
    });
    setSent(true);
    window.setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 1000);
  }

  return (
    <>
      <ActionButton variant="danger" icon={<Flag size={17} />} onClick={() => setOpen(true)}>
        Melden
      </ActionButton>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-night/78 p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-lg p-5">
            <p className="panel-title">Report</p>
            <h2 className="mt-1 text-2xl font-black">Inhalt melden</h2>
            <div className="mt-5 grid gap-2">
              {REPORT_CATEGORIES.map((item) => (
                <button
                  key={item}
                  className={`focus-ring rounded-md border px-4 py-3 text-left text-sm font-bold transition ${
                    category === item
                      ? "border-cyanx bg-cyanx/12 text-white"
                      : "border-white/12 bg-white/6 text-white/72 hover:text-white"
                  }`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <ActionButton className="flex-1" variant="ghost" onClick={() => setOpen(false)}>
                Schliessen
              </ActionButton>
              <ActionButton className="flex-1" variant="primary" icon={<Send size={17} />} onClick={submitReport}>
                {sent ? "Gesendet" : "Senden"}
              </ActionButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
