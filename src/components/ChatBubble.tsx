"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Msg = { role: string; content: string };

export default function ChatBubble() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const historyLenRef = useRef(0);
  const localRef = useRef<Msg[]>([]);

  useEffect(() => {
    if (open) {
      fetchHistory();
      intervalRef.current = setInterval(fetchHistory, 5000);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const btn = document.getElementById("chat-bubble-btn");
        if (btn && btn.contains(e.target as Node)) return;
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/chat/history");
      if (!res.ok) return;
      const data = await res.json();
      if (!data.messages) return;
      if (data.messages.length === historyLenRef.current) return;
      historyLenRef.current = data.messages.length;
      setMessages([...data.messages, ...localRef.current]);
    } catch {}
  }

  if (pathname === "/admin/chat") return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setLoading(true);
    const userMsg: Msg = { role: "user", content: text };
    localRef.current.push(userMsg);
    setMessages((prev) => [...prev, userMsg]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data.response) {
        const asstMsg: Msg = { role: "assistant", content: data.response };
        localRef.current.push(asstMsg);
        setMessages((prev) => [...prev, asstMsg]);
      }
    } catch {}
    setLoading(false);
  }

  return (
    <>
      <button
        id="chat-bubble-btn"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center text-2xl"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-6 z-50 w-[420px] h-[520px] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">M</div>
              <div>
                <p className="text-sm font-semibold text-white">MimoBot</p>
                <p className="text-xs text-green-400">● en ligne</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <a href="/admin/chat" className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors">
                Ouvrir en grand →
              </a>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-gray-500 text-xs text-center mt-8">Aucun message. Écris quelque chose pour commencer !</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-blue-500"
                placeholder="Écris un message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-3 py-2.5 rounded-xl text-sm disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
