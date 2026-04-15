"use client";

import { useMemo, useState, useTransition } from "react";
import { Crown, Send } from "lucide-react";
import { apiFetch, getCurrentUser, parseApiJson } from "@/lib/client-auth";

type TeamOption = {
  id: string;
  name: string;
  university: string;
  region: string;
};

export function LeaderRequestPanel({
  teams,
  defaultTeamId,
}: {
  teams: TeamOption[];
  defaultTeamId?: string;
}) {
  const [selectedTeamId, setSelectedTeamId] = useState(defaultTeamId ?? "");
  const [requestedTeamName, setRequestedTeamName] = useState("");
  const [university, setUniversity] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedTeam = useMemo(() => teams.find((team) => team.id === selectedTeamId) ?? null, [selectedTeamId, teams]);
  const requestingNewTeam = !selectedTeamId;

  async function onSubmit() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setMessage("Avval login qiling, keyin leader request yuboring.");
      return;
    }

    startTransition(async () => {
      const response = await apiFetch("/api/leader-requests", {
        method: "POST",
        body: JSON.stringify({
          teamId: selectedTeam?.id ?? null,
          requestedTeamName: requestingNewTeam ? requestedTeamName : selectedTeam?.name ?? "",
          university: requestingNewTeam ? university : selectedTeam?.university ?? "",
          region: requestingNewTeam ? region : selectedTeam?.region ?? "",
          description,
        }),
      });

      const json = await parseApiJson(response);
      if (!response.ok || !json.success) {
        setMessage(json.message ?? "Request yuborilmadi.");
        return;
      }

      setMessage("Leader request super admin ko&apos;rib chiqishi uchun yuborildi.");
      setDescription("");
      setRequestedTeamName("");
      setUniversity("");
      setRegion("");
    });
  }

  return (
    <div className="surface-card p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Crown className="size-5" />
        </div>
        <div className="flex-1">
          <p className="section-kicker">Become Campus Leader</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Universitetingiz uchun leader request yuboring.</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Agar universitetingiz allaqachon ro&apos;yxatda bo&apos;lsa uni tanlang. Agar yo&apos;q bo&apos;lsa, yangi campus uchun request yuboring va super admin approval&apos;dan keyin leader bo&apos;lasiz.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <select value={selectedTeamId} onChange={(event) => setSelectedTeamId(event.target.value)} className="admin-input">
          <option value="">My university is not listed yet</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.university} - {team.name}
            </option>
          ))}
        </select>

        {requestingNewTeam ? (
          <>
            <input value={requestedTeamName} onChange={(event) => setRequestedTeamName(event.target.value)} className="admin-input" placeholder="Requested campus team name" />
            <input value={university} onChange={(event) => setUniversity(event.target.value)} className="admin-input" placeholder="University name" />
            <input value={region} onChange={(event) => setRegion(event.target.value)} className="admin-input" placeholder="Region / address" />
          </>
        ) : (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
            Request tanlangan campus uchun yuboriladi: <span className="font-semibold">{selectedTeam?.university}</span>, {selectedTeam?.region}
          </div>
        )}

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="admin-input min-h-28 resize-y"
          placeholder="Why do you want to lead this campus community?"
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Send className="size-4" />
          {isPending ? "Sending request..." : "Request Campus Leader Role"}
        </button>

        {message ? <p className="text-sm font-medium text-slate-700">{message}</p> : null}
      </div>
    </div>
  );
}
