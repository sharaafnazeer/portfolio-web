"use client";

import { Download, Printer } from "lucide-react";

type ResumeActionsProps = {
  /** Path to the downloadable PDF (e.g. `/files/sharaaf-nazeer-resume.pdf`). */
  pdfUrl: string;
};

/**
 * Two-button toolbar shown on the /resume page (screen only):
 *   1. Download the canonical PDF
 *   2. Trigger the browser's print dialog, which the print stylesheet
 *      reformats for a clean B&W PDF.
 */
export function ResumeActions({ pdfUrl }: ResumeActionsProps) {
  return (
    <div className="flex items-center gap-2 print:hidden">
      <a
        href={pdfUrl}
        download
        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-foreground px-3 py-1.5 text-sm text-background transition-opacity hover:opacity-90"
      >
        <Download className="size-3.5" />
        <span>Download PDF</span>
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand/60 hover:text-foreground"
      >
        <Printer className="size-3.5" />
        <span>Print</span>
      </button>
    </div>
  );
}
