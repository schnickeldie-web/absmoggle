"use client";

import { useState } from "react";
import { Check, ShieldAlert } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { useUserStore } from "@/store/use-user-store";
import { validateUsername } from "@/lib/username";

type UsernameDialogProps = {
  open: boolean;
  onClose?: () => void;
};

export function UsernameDialog({ open, onClose }: UsernameDialogProps) {
  const setUsername = useUserStore((state) => state.setUsername);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);

  if (!open) return null;

  async function saveUsername() {
    const result = validateUsername(value);
    if (!result.valid) {
      setMessage(result.message);
      return;
    }

    setChecking(true);
    try {
      const response = await fetch(`/api/username/check?username=${encodeURIComponent(result.normalized)}`);
      const data = (await response.json()) as { available: boolean; message: string };
      if (!data.available) {
        setMessage(data.message);
        return;
      }
      setUsername(result.normalized);
      onClose?.();
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-night/78 p-4 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-lg p-5">
        <div className="flex items-start gap-3">
          <div className="grid size-11 place-items-center rounded-md border border-cyanx/40 bg-cyanx/12 text-cyanx">
            <ShieldAlert size={22} />
          </div>
          <div>
            <p className="panel-title">Identity Lock</p>
            <h2 className="mt-1 text-2xl font-black">Username waehlen</h2>
          </div>
        </div>
        <input
          className="focus-ring mt-5 w-full rounded-md border border-white/14 bg-black/40 px-4 py-3 text-base font-bold text-white placeholder:text-white/35"
          placeholder="Benjamin"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={20}
        />
        {message ? <p className="mt-3 text-sm font-semibold text-dangerx">{message}</p> : null}
        <ActionButton
          className="mt-5 w-full"
          variant="primary"
          icon={<Check size={18} />}
          onClick={saveUsername}
          disabled={checking}
        >
          {checking ? "Pruefen..." : "Speichern"}
        </ActionButton>
      </div>
    </div>
  );
}
