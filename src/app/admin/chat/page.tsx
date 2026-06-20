"use client";

import { useState, useEffect, useRef } from "react";

type Msg = { role: string; content: string };

export default function AdminChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [botOnline, setBotOnline] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<Msg[]>([]);

  useEffect(() => {
    fetchHistory();
    const id = setInterval(fetchHistory, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("https://mimo-bot-ukhy.onrender.com/health", { signal: AbortSignal.timeout(5000) });
        setBotOnline(res.ok);
      } catch { setBotOnline(false); }
    };
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/chat/history");
      if (!res.ok) return;
      const data = await res.json();
      if (data.messages) setMessages([...data.messages, ...localRef.current]);
    } catch {}
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setLoading(true);
    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    localRef.current = [...localRef.current, userMsg];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data.response) {
        const asst = { role: "assistant" as const, content: data.response };
        setMessages((prev) => [...prev, asst]);
        localRef.current = [...localRef.current, asst];
      }
    } catch {}
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <h1 className="text-2xl font-bold mb-4">Chat avec MimoBot</h1>
      <div className="flex-1 overflow-y-auto border border-gray-200 rounded-xl bg-white p-4 space-y-3 mb-4 relative">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-8">Aucun message. Écris quelque chose pour commencer !</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-xl px-4 py-2 text-sm whitespace-pre-wrap ${
              m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
        <div className="sticky bottom-0 left-0 right-0 flex items-center justify-center gap-2 pt-3 pb-1 bg-white/80 backdrop-blur-sm border-t border-gray-100 mt-2">
          <span className={`w-2 h-2 rounded-full ${botOnline ? "bg-green-500" : "bg-red-500"}`}></span>
          <span className="text-xs text-gray-400">
            @MimoBot_bot — {botOnline ? "Connecté" : "Déconnecté"}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          placeholder="Écris un message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
        >
          {loading ? "…" : "Envoyer"}
        </button>
      </div>
    </div>
  );
}
