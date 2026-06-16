"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PDFViewer({ fileUrl, title }: { fileUrl: string; title: string }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  const handlePrint = useCallback(() => {
    const printWin = window.open("", "_blank");
    if (!printWin) { alert("Autorise les pop-ups pour imprimer"); return; }

    const doc = printRef.current;
    if (!doc) return;

    const allCanvases = doc.querySelectorAll("canvas");
    const html = Array.from(allCanvases)
      .map((c, i) => `<div style="page-break-after:always;margin:0;text-align:center">${c.outerHTML}</div>`)
      .join("");

    printWin.document.write(`<!DOCTYPE html><html><head>
      <title>${title}</title>
      <style>
        @page { margin: 0; }
        body { margin: 0; padding: 0; }
        canvas { max-width: 100%; height: auto; }
      </style>
    </head><body>${html}</body></html>`);
    printWin.document.close();

    setTimeout(() => { printWin.print(); printWin.close(); }, 500);
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
          {loading ? "Chargement..." : `${pageNumber} / ${numPages}`}
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
        <Document
          file={fileUrl}
          onLoadSuccess={onLoadSuccess}
          onLoadError={(e) => { console.error("PDF load error:", e); setLoading(false); }}
          loading={<div className="text-white/60 pt-20 text-center font-display">Chargement du document...</div>}
        >
          <div className="shadow-2xl mb-4">
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </div>
        </Document>
      </div>

      <div ref={printRef} className="hidden">
        <Document file={fileUrl}>
          {Array.from({ length: numPages }, (_, i) => (
            <Page key={i + 1} pageNumber={i + 1} width={794} renderTextLayer={false} renderAnnotationLayer={false} />
          ))}
        </Document>
      </div>
    </div>
  );
}
