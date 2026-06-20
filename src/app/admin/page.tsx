"use client";

import { useEffect, useState } from "react";

const DAYS = ["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"];

type Row = { time: string; slots: string[] };

export default function AdminDashboard() {
  const [stats, setStats] = useState({ lessons: 0, exercises: 0, resources: 0 });
  const [schedule, setSchedule] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/schedule").then((r) => r.json()),
    ]).then(([statsData, scheduleData]) => {
      setStats(statsData);
      setSchedule(scheduleData.schedule);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedule }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) setEditing(false);
    else alert(data.error || "Erreur lors de la sauvegarde");
  };

  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const copy = schedule.map((r) => ({ ...r, slots: [...r.slots] }));
    copy[rowIdx].slots[colIdx] = value;
    setSchedule(copy);
  };

  const addRow = () => {
    const last = schedule[schedule.length - 1];
    const match = last && last.time.match(/[–-]\s*(\d+)/);
    const end = match ? parseInt(match[1]) : 15;
    const time = `${String(end).padStart(2, "0")}:00 – ${String(end + 1).padStart(2, "0")}:00`;
    setSchedule([...schedule, { time, slots: ["", "", "", "", "", ""] }]);
  };

  const removeRow = (idx: number) => {
    if (schedule.length <= 1) return;
    setSchedule(schedule.filter((_, i) => i !== idx));
  };

  const cards = [
    { label: "Leçons", count: stats.lessons, href: "/admin/lessons", color: "bg-blue-50 text-blue-700" },
    { label: "Exercices", count: stats.exercises, href: "/admin/exercises", color: "bg-green-50 text-green-700" },
    { label: "Fiches pédagogiques", count: stats.resources, href: "/admin/resources", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <a key={c.href} href={c.href} className={`p-6 rounded-xl ${c.color} border border-current/10`}>
            <p className="text-3xl font-bold">{c.count}</p>
            <p className="text-sm mt-1 opacity-80">{c.label}</p>
          </a>
        ))}
      </div>

      <div className="sticker rounded-2xl p-6 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
            <i className="fa-solid fa-calendar-days text-sun"></i> Emploi du temps
          </h2>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button onClick={() => { setEditing(false); fetch("/api/admin/schedule").then(r => r.json()).then(d => setSchedule(d.schedule)); }}
                  className="btn-outline text-xs !py-2 !px-4">Annuler</button>
                <button onClick={handleSave} disabled={saving}
                  className="btn-primary text-xs !py-2 !px-4" style={{ fontSize: "0.75rem", padding: "8px 16px" }}>
                  {saving ? "Sauvegarde..." : <><i className="fa-regular fa-floppy-disk"></i> Enregistrer</>}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="btn-outline text-xs !py-2 !px-4">
                <i className="fa-regular fa-pen-to-square"></i> Modifier
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 animate-pulse">📅</div>
            <p className="font-display text-ink/40 text-lg">Chargement de l'emploi du temps...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto pb-2">
              <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: "6px" }}>
                <thead>
                  <tr>
                    <th className="font-display font-bold text-ink/50 text-xs text-left px-3 py-2 min-w-[90px]">Horaire</th>
                    {DAYS.map((d) => (
                      <th key={d} className="font-display font-bold text-ink text-xs text-center px-3 py-2 min-w-[100px] bg-sun-light rounded-xl border-2 border-ink">
                        {d}
                      </th>
                    ))}
                    {editing && <th className="w-[40px]"></th>}
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row, i) => {
                    const timeBg = i % 2 === 0 ? "bg-sun-light" : "bg-white";
                    return (
                      <tr key={i}>
                        <td className={`font-display font-bold text-ink rounded-xl border-2 border-ink px-3 py-3 text-xs text-center shadow-[2px_2px_0px_#1A1A2E] ${timeBg}`}>
                          {row.time}
                        </td>
                        {row.slots.map((cell, j) => {
                          const level = cell.match(/^(1AM|2AM|3AM|4AM)/)?.[1] || "";
                          const bgMap: Record<string, string> = {
                            "1AM": "bg-mint-light border-mint text-mint",
                            "2AM": "bg-blue-light border-blue text-blue",
                            "3AM": "bg-coral-light border-coral text-coral",
                            "4AM": "bg-sun-light border-sun text-ink",
                          };
                          const cellStyle = level ? bgMap[level] || "bg-blue-light border-blue text-blue" : "";
                          return (
                            <td key={j} className="p-1 text-center">
                              {editing ? (
                                <input
                                  value={cell}
                                  onChange={(e) => updateCell(i, j, e.target.value)}
                                  placeholder="—"
                                  className="w-full text-xs text-center p-2 border-2 border-ink rounded-xl bg-white focus:outline-none focus:shadow-[2px_2px_0px_#FFC857] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all font-display font-bold"
                                />
                              ) : (
                                <span className={`text-xs font-display font-bold px-2 py-2 rounded-xl border-2 block min-h-[36px] flex items-center justify-center leading-tight ${cellStyle || "bg-cream border-2 border-transparent text-ink/20"}`}>
                                  {cell || "—"}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        {editing && (
                          <td className="p-1 text-center">
                            {schedule.length > 1 && (
                              <button onClick={() => removeRow(i)} className="w-8 h-8 rounded-xl border-2 border-coral bg-coral-light text-coral hover:bg-coral hover:text-white transition-colors text-sm" title="Supprimer ce créneau">
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {editing && (
              <div className="flex justify-center mt-4 gap-3 flex-wrap">
                <button onClick={addRow} className="btn-outline text-xs !py-2 !px-5">
                  <i className="fa-solid fa-plus"></i> Ajouter un créneau
                </button>
              </div>
            )}
            {!editing && (
              <p className="text-center mt-4 text-xs text-ink/30 font-display">
                <i className="fa-regular fa-clock mr-1"></i> Cliquez sur "Modifier" pour mettre à jour votre emploi du temps
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
