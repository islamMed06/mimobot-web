"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export default function PDFViewer({ resourceId, title, contentType = "resource" }: { resourceId: string; title: string; contentType?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState("");
  const pdfRef = useRef<any>(null);

  const renderAllPages = useCallback(async (pdf: any, s: number) => {
    const container = canvasContainerRef.current;
    if (!container) return;
    container.innerHTML = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: s });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.className = "shadow-2xl mb-4 mx-auto";
      canvas.style.display = "block";
      container.appendChild(canvas);

      await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/pdf-proxy/${resourceId}?type=${contentType}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();

        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
        pdfRef.current = pdf;
        setLoading(false);
      } catch (e: any) {
        console.error("PDF init error:", e);
        setError(e.message || "Erreur de chargement");
        setLoading(false);
      }
    })();
  }, [resourceId]);

  useEffect(() => {
    if (!loading && pdfRef.current) {
      renderAllPages(pdfRef.current, scale);
    }
  }, [scale, loading]);

  const handlePrint = useCallback(async () => {
    const pdf = pdfRef.current;
    if (!pdf) return;

    const images: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const c = document.createElement("canvas");
      c.width = viewport.width;
      c.height = viewport.height;
      await page.render({ canvasContext: c.getContext("2d")!, viewport }).promise;
      images.push(c.toDataURL());
    }

    const printWin = window.open("", "_blank");
    if (!printWin) { alert("Autorise les pop-ups pour imprimer"); return; }

    printWin.document.write(`<!DOCTYPE html><html><head>
      <title>${title}</title>
      <style>
        @page { margin: 0; }
        body { margin: 0; padding: 0; }
        img { display: block; width: 100%; max-width: 210mm; margin: 0 auto; }
      </style>
    </head><body>${images.map((src) => `<img src="${src}" />`).join("")}</body></html>`);
    printWin.document.close();
    setTimeout(() => { printWin.print(); printWin.close(); }, 500);
  }, [title]);

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="bg-[#3a3a3a] flex items-center justify-between px-4 py-2 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            className="px-2 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
            title="Zoom arrière"
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <span className="text-white/80 text-xs w-12 text-center font-display">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(2, s + 0.25))}
            className="px-2 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
            title="Zoom avant"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
          <button
            onClick={() => setScale(1)}
            className="px-2 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition-colors ml-1"
            title="Taille réelle"
          >
            <i className="fa-solid fa-expand"></i>
          </button>
        </div>

        <span className="text-white/60 text-xs font-display">
          {loading ? "Chargement..." : error ? "Erreur" : ""}
        </span>

        <button
          onClick={handlePrint}
          className="px-4 py-1.5 rounded bg-white text-gray-800 text-sm font-display font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          title="Imprimer"
        >
          <i className="fa-solid fa-print"></i>
          <span className="hidden sm:inline">Imprimer</span>
        </button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto bg-[#525659]">
        {loading && (
          <div className="text-white/60 pt-20 text-center font-display">Chargement du document...</div>
        )}
        {error && (
          <div className="text-red-400 pt-20 text-center font-display">
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>
            Échec du chargement du PDF
          </div>
        )}
        <div ref={canvasContainerRef} className="py-6 px-4" />
      </div>
    </div>
  );
}
