import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: "cyan" | "pink" | "mint" | "amber";
};

const tones = {
  cyan: "text-cyanx shadow-neon",
  pink: "text-pinkx shadow-pink",
  mint: "text-mintx",
  amber: "text-amberx"
};

export function StatCard({ label, value, icon, tone = "cyan" }: StatCardProps) {
  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="panel-title">{label}</p>
        <div className={`grid size-10 place-items-center rounded-md border border-white/12 bg-white/8 ${tones[tone]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 text-3xl font-black tracking-normal">{value}</div>
    </div>
  );
}
