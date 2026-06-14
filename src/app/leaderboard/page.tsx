import { Trophy } from "lucide-react";
import { verifiedLeaderboard } from "@/lib/mock-data";

export default function LeaderboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="panel-title">Leaderboard</p>
        <h1 className="mt-1 text-4xl font-black">Verified Streak Ranking</h1>
      </div>
      <section className="glass-panel rounded-lg p-5">
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="grid grid-cols-[72px_1fr_110px_110px_110px] bg-white/8 px-4 py-3 text-xs font-black uppercase text-white/56">
            <span>Rank</span>
            <span>User</span>
            <span className="text-right">Streak</span>
            <span className="text-right">Avg</span>
            <span className="text-right">Wins</span>
          </div>
          {verifiedLeaderboard.length ? (
            verifiedLeaderboard.map((player, index) => (
              <div key={player.id} className="grid grid-cols-[72px_1fr_110px_110px_110px] border-t border-white/8 px-4 py-4">
                <span className="font-black text-white/55">#{index + 1}</span>
                <span className="font-bold">{player.username}</span>
                <span className="text-right font-black text-cyanx">{player.currentStreak}</span>
                <span className="text-right font-black">{player.averageScore}</span>
                <span className="text-right font-black">{player.totalWins}</span>
              </div>
            ))
          ) : (
            <div className="grid min-h-72 place-items-center p-8 text-center">
              <div>
                <Trophy className="mx-auto text-amberx" size={46} />
                <p className="mt-4 max-w-md text-sm font-semibold text-white/64">
                  Noch keine echten Matchdaten. Bots und Demo-Spieler werden hier nicht gelistet.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
