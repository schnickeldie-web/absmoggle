import { notFound } from "next/navigation";
import { demoUsers } from "@/lib/mock-data";
import { StatCard } from "@/components/stat-card";
import { Activity, Flame, Trophy, Users } from "lucide-react";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = demoUsers.find((item) => item.username.toLowerCase() === decodeURIComponent(username).toLowerCase());

  if (!user) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="grid size-16 place-items-center rounded-lg bg-cyanx text-xl font-black text-night">
          {user.avatar}
        </div>
        <div>
          <p className="panel-title">Player Profile</p>
          <h1 className="mt-1 text-4xl font-black">{user.username}</h1>
        </div>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Best Score" value={user.averageScore || "--"} icon={<Trophy size={20} />} />
        <StatCard label="Current Streak" value={user.currentStreak} icon={<Flame size={20} />} tone="pink" />
        <StatCard label="Matches" value={user.totalMatches} icon={<Activity size={20} />} tone="mint" />
        <StatCard label="Wins" value={user.totalWins} icon={<Users size={20} />} tone="amber" />
      </section>
      <section className="glass-panel mt-6 rounded-lg p-5">
        <p className="panel-title">Match History</p>
        <div className="mt-4 grid min-h-40 place-items-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-white/62">
          Noch keine gespeicherten Matches.
        </div>
      </section>
    </main>
  );
}
