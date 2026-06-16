"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export default function PDFViewer({ resourceId, title }: { resourceId: string; title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState("");
  const pdfRef = useRef<any>(null);
  const pdfDataRef = useRef<ArrayBuffer | null>(null);
  const allPagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/pdf-proxy/${resourceId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        pdfDataRef.current = buf;

        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
        renderPage(pdf, 1, scale);
      } catch (e: any) {
        console.error("PDF init error:", e);
        setError(e.message || "Erreur de chargement");
        setLoading(false);
      }
    })();
  }, [resourceId]);

  useEffect(() => {
    if (pdfRef.current && !loading) {
      renderPage(pdfRef.current, pageNumber, scale);
    }
  }, [pageNumber, scale, loading]);

  const renderPage = useCallback(async (pdf: any, pageNum: number, s: number) => {
    if (!canvasRef.current) return;
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: s });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (e) {
      console.error("Render error:", e);
    }
  }, []);

  const handlePrint = useCallback(async () => {
    const pdf = pdfRef.current;
    if (!pdf) return;

    const printWin = window.open("", "_blank");
    if (!printWin) { alert("Autorise les pop-ups pour imprimer"); return; }

    const canvases: string[] = [];
    const pdfjsLib = await import("pdfjs-dist");

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const c = document.createElement("canvas");
      c.width = viewport.width;
      c.height = viewport.height;
      await page.render({ canvasContext: c.getContext("2d")!, viewport }).promise;
      canvases.push(`<div style="page-break-after:always;margin:0;text-align:center">${c.outerHTML}</div>`);
    }

    printWin.document.write(`<!DOCTYPE html><html><head>
      <title>${title}</title>
      <style>
        @page { margin: 0; }
        body { margin: 0; padding: 0; }
        canvas { max-width: 100%; height: auto; }
      </style>
    </head><body>${canvases.join("")}</body></html>`);
    printWin.document.close();
    setTimeout(() => { printWin.print(); printWin.close(); }, 1000);
  }, [title]);

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="bg-[#3a3a3a] flex items-center justify-between px-3 py-2 gap-2 shrink-0">
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          className="px-3 py-1.5 rounded bg-white/10 text-white text-sm hover:bg-white/20 disabled:opacity-30 transition-colors"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <span className="text-white/80 text-sm font-display">
          {loading ? "Chargement..." : error ? "Erreur" : `${pageNumber} / ${numPages}`}
        </span>

        <button
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
          className="px-3 py-1.5 rounded bg-white/10 text-white text-sm hover:bg-white/20 disabled:opacity-30 transition-colors"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            className="px-2 py-1 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <span className="text-white/80 text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(2, s + 0.25))}
            className="px-2 py-1 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="ml-auto px-4 py-1.5 rounded bg-white text-gray-800 text-sm font-display font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
        >
          <i className="fa-solid fa-print"></i>
          <span className="hidden sm:inline">Imprimer</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-[#525659] flex justify-center p-4">
        {loading && (
          <div className="text-white/60 pt-20 text-center font-display">Chargement du document...</div>
        )}
        {error && (
          <div className="text-red-400 pt-20 text-center font-display">
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>
            Échec du chargement du PDF
          </div>
        )}
        {!loading && !error && (
          <canvas ref={canvasRef} className="shadow-2xl" />
        )}
      </div>
    </div>
  );
}
