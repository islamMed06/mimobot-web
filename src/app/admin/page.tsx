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
    setSchedule([...schedule, { time: "15:00 – 16:00", slots: ["", "", "", "", "", ""] }]);
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

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Emploi du temps</h2>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button onClick={() => { setEditing(false); fetch("/api/admin/schedule").then(r => r.json()).then(d => setSchedule(d.schedule)); }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {saving ? "Sauvegarde..." : "Enregistrer"}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors inline-flex items-center gap-1">
                <i className="fa-regular fa-pen-to-square"></i> Modifier
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Chargement...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-200 bg-gray-50 p-2 text-left font-semibold text-gray-600 min-w-[80px]">Horaire</th>
                    {DAYS.map((d) => (
                      <th key={d} className="border border-gray-200 bg-gray-50 p-2 text-center font-semibold text-gray-600 min-w-[100px]">{d}</th>
                    ))}
                    {editing && <th className="border border-gray-200 bg-gray-50 p-2 text-center font-semibold text-gray-400 w-[40px]"></th>}
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-gray-200 p-2 text-gray-500 font-medium text-xs whitespace-nowrap">{row.time}</td>
                      {row.slots.map((cell, j) => (
                        <td key={j} className="border border-gray-200 p-1 text-center">
                          {editing ? (
                            <input
                              value={cell}
                              onChange={(e) => updateCell(i, j, e.target.value)}
                              placeholder="—"
                              className="w-full text-xs text-center p-1 border border-gray-200 rounded focus:outline-none focus:border-blue-400 bg-transparent"
                            />
                          ) : (
                            <span className={`text-xs ${cell ? "bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded block" : "text-gray-300"}`}>
                              {cell || "—"}
                            </span>
                          )}
                        </td>
                      ))}
                      {editing && (
                        <td className="border border-gray-200 p-1 text-center">
                          {schedule.length > 1 && (
                            <button onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600 text-xs" title="Supprimer ce créneau">
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {editing && (
              <button onClick={addRow} className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors inline-flex items-center gap-1">
                <i className="fa-solid fa-plus"></i> Ajouter un créneau
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
