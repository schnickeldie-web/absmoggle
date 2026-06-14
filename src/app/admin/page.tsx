"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Ban,
  Bell,
  Camera,
  Check,
  Clock,
  Database,
  Flag,
  History,
  Lock,
  Megaphone,
  RotateCcw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  UserPlus,
  Users,
  Wifi
} from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { StatCard } from "@/components/stat-card";
import { UsernameDialog } from "@/components/username-dialog";
import { BAN_TYPES } from "@/lib/constants";
import { isAdminUser } from "@/lib/admin";
import { useAdminStore } from "@/store/use-admin-store";
import { useUserStore } from "@/store/use-user-store";

export default function AdminPage() {
  const username = useUserStore((state) => state.username);
  const extraAdmins = useUserStore((state) => state.extraAdmins);
  const addLocalAdmin = useUserStore((state) => state.addAdmin);
  const canSeeAdmin = isAdminUser(username, extraAdmins);

  const {
    announcement,
    users,
    reports,
    settings,
    setAnnouncement,
    updateSettings,
    banUser,
    unbanUser,
    resetRanking,
    markWebcamViolation,
    addUserNote,
    promoteToAdmin,
    resolveReport
  } = useAdminStore();

  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "");
  const [banReason, setBanReason] = useState("Policy violation");
  const [banType, setBanType] = useState<(typeof BAN_TYPES)[number]>("Temporaer");
  const [adminName, setAdminName] = useState("");
  const [note, setNote] = useState("");
  const [draftAnnouncement, setDraftAnnouncement] = useState(announcement);

  const filteredUsers = useMemo(
    () => users.filter((user) => user.username.toLowerCase().includes(search.toLowerCase())),
    [search, users]
  );

  const selectedUser = users.find((user) => user.id === selectedUserId) ?? users[0];
  const onlineUsers = users.filter((user) => user.status === "ONLINE").length;
  const bannedUsers = users.filter((user) => user.status === "BANNED").length;

  if (!canSeeAdmin) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-3xl place-items-center px-4 py-10">
        <UsernameDialog open={!username} />
        <section className="glass-panel rounded-lg p-6 text-center">
          <Lock className="mx-auto text-cyanx" size={46} />
          <p className="panel-title mt-4">Admin Panel</p>
          <h1 className="mt-2 text-3xl font-black">Nur fuer den Owner sichtbar</h1>
          <p className="mt-4 text-sm font-semibold leading-6 text-white/68">
            Der initiale Owner kommt aus NEXT_PUBLIC_INITIAL_ADMIN_USERNAME.
          </p>
        </section>
      </main>
    );
  }

  function promoteAdmin() {
    if (!adminName.trim()) return;
    promoteToAdmin(adminName.trim());
    addLocalAdmin(adminName.trim());
    setAdminName("");
  }

  function executeBan() {
    if (!selectedUser) return;
    banUser({ userId: selectedUser.id, reason: banReason, type: banType });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="panel-title">Owner Console</p>
          <h1 className="mt-1 text-4xl font-black">Admin Panel</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            icon={<ShieldCheck size={17} />}
            variant={settings.maintenanceMode ? "danger" : "secondary"}
            onClick={() => updateSettings({ maintenanceMode: !settings.maintenanceMode })}
          >
            Wartung
          </ActionButton>
          <ActionButton
            icon={<UserPlus size={17} />}
            variant={settings.registrationEnabled ? "secondary" : "danger"}
            onClick={() => updateSettings({ registrationEnabled: !settings.registrationEnabled })}
          >
            Registrierung
          </ActionButton>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Online Nutzer" value={onlineUsers} icon={<Users size={20} />} />
        <StatCard label="Matches heute" value="0" icon={<History size={20} />} tone="pink" />
        <StatCard label="Gebannte Nutzer" value={bannedUsers} icon={<Ban size={20} />} tone="amber" />
        <StatCard label="Aktive Kameras" value={onlineUsers} icon={<Camera size={20} />} tone="mint" />
        <StatCard label="Aktive Benutzer" value={users.length} icon={<Shield size={20} />} />
        <StatCard label="Matches insgesamt" value="0" icon={<Database size={20} />} tone="pink" />
        <StatCard label="Neue Registrierungen" value={users.length} icon={<UserPlus size={20} />} tone="mint" />
        <StatCard label="Avg Matchdauer" value={`${settings.matchTimer}s`} icon={<Clock size={20} />} tone="amber" />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="glass-panel rounded-lg p-5">
          <div className="flex items-center gap-3">
            <Megaphone className="text-amberx" size={22} />
            <div>
              <p className="panel-title">Startseite</p>
              <h2 className="text-2xl font-black">Ankuendigungsfeld</h2>
            </div>
          </div>
          <textarea
            className="focus-ring mt-5 min-h-28 w-full rounded-md border border-white/14 bg-black/35 p-4 text-sm font-semibold text-white"
            value={draftAnnouncement}
            onChange={(event) => setDraftAnnouncement(event.target.value)}
          />
          <ActionButton
            className="mt-4"
            variant="primary"
            icon={<Check size={17} />}
            onClick={() => setAnnouncement(draftAnnouncement)}
          >
            Veröffentlichen
          </ActionButton>
        </div>

        <div className="glass-panel rounded-lg p-5">
          <div className="flex items-center gap-3">
            <UserPlus className="text-cyanx" size={22} />
            <div>
              <p className="panel-title">Admins</p>
              <h2 className="text-2xl font-black">Zugriff erweitern</h2>
            </div>
          </div>
          <input
            className="focus-ring mt-5 w-full rounded-md border border-white/14 bg-black/35 px-4 py-3 text-sm font-bold text-white"
            placeholder="Username"
            value={adminName}
            onChange={(event) => setAdminName(event.target.value)}
          />
          <ActionButton className="mt-4 w-full" variant="primary" icon={<Shield size={17} />} onClick={promoteAdmin}>
            Zum Admin Panel hinzufuegen
          </ActionButton>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="glass-panel rounded-lg p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="panel-title">User Management</p>
              <h2 className="text-2xl font-black">Benutzer suchen</h2>
            </div>
            <label className="focus-within:ring-cyanx flex min-h-11 w-full items-center gap-2 rounded-md border border-white/14 bg-black/35 px-3 md:max-w-xs">
              <Search size={17} className="text-white/45" />
              <input
                className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/35"
                placeholder="Username suchen"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <div className="mt-5 overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="bg-white/8 text-left text-xs uppercase text-white/52">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">IP</th>
                  <th className="px-4 py-3">Webcam</th>
                  <th className="px-4 py-3 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-white/8">
                    <td className="px-4 py-3">
                      <button
                        className="flex items-center gap-3 text-left"
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <span className="grid size-9 place-items-center rounded-md bg-cyanx text-xs font-black text-night">
                          {user.avatar}
                        </span>
                        <span className="font-black">{user.username}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3 font-bold text-white/70">{user.status}</td>
                    <td className="px-4 py-3 font-bold text-white/70">{user.role}</td>
                    <td className="px-4 py-3 font-bold text-white/70">{user.ipAddress}</td>
                    <td className="px-4 py-3 font-black text-pinkx">{user.webcamViolations}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="focus-ring grid size-9 place-items-center rounded-md border border-white/12 bg-white/8 text-cyanx"
                          title="Ranking zuruecksetzen"
                          onClick={() => resetRanking(user.id)}
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button
                          className="focus-ring grid size-9 place-items-center rounded-md border border-white/12 bg-white/8 text-amberx"
                          title="Webcam-Verstoss markieren"
                          onClick={() => markWebcamViolation(user.id)}
                        >
                          <Camera size={16} />
                        </button>
                        {user.status === "BANNED" ? (
                          <button
                            className="focus-ring grid size-9 place-items-center rounded-md border border-mintx/35 bg-mintx/12 text-mintx"
                            title="Entsperren"
                            onClick={() => unbanUser(user.id)}
                          >
                            <Check size={16} />
                          </button>
                        ) : (
                          <button
                            className="focus-ring grid size-9 place-items-center rounded-md border border-dangerx/40 bg-dangerx/12 text-dangerx"
                            title="Sperren"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              executeBan();
                            }}
                          >
                            <Ban size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="glass-panel rounded-lg p-5">
          <p className="panel-title">Ausgewaehlter User</p>
          {selectedUser ? (
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-md bg-pinkx text-sm font-black text-night">
                  {selectedUser.avatar}
                </span>
                <div>
                  <h3 className="text-xl font-black">{selectedUser.username}</h3>
                  <p className="text-sm font-bold text-white/54">{selectedUser.status}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <select
                  className="focus-ring rounded-md border border-white/14 bg-black/35 px-4 py-3 text-sm font-bold text-white"
                  value={banType}
                  onChange={(event) => setBanType(event.target.value as typeof banType)}
                >
                  {BAN_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                <input
                  className="focus-ring rounded-md border border-white/14 bg-black/35 px-4 py-3 text-sm font-bold text-white"
                  value={banReason}
                  onChange={(event) => setBanReason(event.target.value)}
                  placeholder="Ban-Grund"
                />
                <ActionButton variant="danger" icon={<Ban size={17} />} onClick={executeBan}>
                  Benutzer sperren
                </ActionButton>
                <ActionButton icon={<Check size={17} />} onClick={() => unbanUser(selectedUser.id)}>
                  Entsperren
                </ActionButton>
              </div>

              <textarea
                className="focus-ring mt-5 min-h-24 w-full rounded-md border border-white/14 bg-black/35 p-3 text-sm font-semibold text-white"
                placeholder="Notiz"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <ActionButton
                className="mt-3 w-full"
                icon={<Bell size={17} />}
                onClick={() => {
                  addUserNote(selectedUser.id, note);
                  setNote("");
                }}
              >
                Notiz speichern
              </ActionButton>

              <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="panel-title">Match-Historie</p>
                <div className="mt-3 text-sm font-semibold text-white/62">
                  {selectedUser.matchHistory.length ? "Matches vorhanden" : "Noch keine Matches"}
                </div>
              </div>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="glass-panel rounded-lg p-5">
          <div className="flex items-center gap-3">
            <Flag className="text-dangerx" size={22} />
            <div>
              <p className="panel-title">Reports</p>
              <h2 className="text-2xl font-black">Meldungen</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {reports.map((report) => (
              <div key={report.id} className="grid gap-4 rounded-lg border border-white/10 bg-white/6 p-3 md:grid-cols-[160px_1fr_auto]">
                <Image
                  src={report.screenshotUrl}
                  alt=""
                  width={320}
                  height={180}
                  className="h-28 w-full rounded-md border border-white/10 object-cover md:w-40"
                />
                <div>
                  <p className="text-sm font-black text-white">{report.category}</p>
                  <p className="mt-1 text-xs font-bold text-white/56">Match-ID: {report.matchId}</p>
                  <p className="mt-1 text-xs font-bold text-white/56">
                    User: {report.reportedUser} / Reporter: {report.reporter}
                  </p>
                  <p className="mt-1 text-xs font-bold text-white/56">
                    Zeitpunkt: {new Date(report.createdAt).toLocaleString("de-DE")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:flex-col">
                  <ActionButton className="min-w-28" icon={<Bell size={16} />} onClick={() => resolveReport(report.id)}>
                    Warnung
                  </ActionButton>
                  <ActionButton className="min-w-28" icon={<RotateCcw size={16} />} onClick={() => resolveReport(report.id)}>
                    Abbruch
                  </ActionButton>
                  <ActionButton className="min-w-28" variant="danger" icon={<Ban size={16} />} onClick={() => resolveReport(report.id)}>
                    Ban
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="glass-panel rounded-lg p-5">
          <div className="flex items-center gap-3">
            <Settings className="text-cyanx" size={22} />
            <div>
              <p className="panel-title">System</p>
              <h2 className="text-2xl font-black">Einstellungen</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-white/54">Match-Timer</span>
              <input
                type="number"
                className="focus-ring rounded-md border border-white/14 bg-black/35 px-4 py-3 text-sm font-bold text-white"
                value={settings.matchTimer}
                onChange={(event) => updateSettings({ matchTimer: Number(event.target.value) })}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-white/54">Max. Matchdauer</span>
              <input
                type="number"
                className="focus-ring rounded-md border border-white/14 bg-black/35 px-4 py-3 text-sm font-bold text-white"
                value={settings.maxMatchDuration}
                onChange={(event) => updateSettings({ maxMatchDuration: Number(event.target.value) })}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-white/54">Ranking-Formel</span>
              <input
                className="focus-ring rounded-md border border-white/14 bg-black/35 px-4 py-3 text-sm font-bold text-white"
                value={settings.rankingFormula}
                onChange={(event) => updateSettings({ rankingFormula: event.target.value })}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-white/54">TURN Server</span>
              <input
                className="focus-ring rounded-md border border-white/14 bg-black/35 px-4 py-3 text-sm font-bold text-white"
                value={settings.turnServerUrl}
                onChange={(event) => updateSettings({ turnServerUrl: event.target.value })}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-white/54">WebRTC Policy</span>
              <select
                className="focus-ring rounded-md border border-white/14 bg-black/35 px-4 py-3 text-sm font-bold text-white"
                value={settings.webRtcPolicy}
                onChange={(event) => updateSettings({ webRtcPolicy: event.target.value as "relay" | "all" })}
              >
                <option value="all">all</option>
                <option value="relay">relay</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                icon={<Wifi size={17} />}
                variant={settings.maintenanceMode ? "danger" : "secondary"}
                onClick={() => updateSettings({ maintenanceMode: !settings.maintenanceMode })}
              >
                Wartung
              </ActionButton>
              <ActionButton
                icon={<UserPlus size={17} />}
                variant={settings.registrationEnabled ? "secondary" : "danger"}
                onClick={() => updateSettings({ registrationEnabled: !settings.registrationEnabled })}
              >
                Signup
              </ActionButton>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
