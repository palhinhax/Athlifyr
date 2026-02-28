import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Athlifyr brand colours — matching the ticket modal exactly:
 *   Header gradient: #F5A623 → rgba(245,166,35,0.75)  (horizontal, left→right)
 *   Dark text:       #1a0e00
 *   Table header bg: #F5A623
 */
const GOLDEN_RGB: [number, number, number] = [245, 166, 35]; // #F5A623
const GOLDEN_LIGHT_RGB: [number, number, number] = [250, 200, 100]; // right side of gradient
const DARK_TEXT: [number, number, number] = [26, 14, 0]; // #1a0e00
const DARK_MUTED: [number, number, number] = [80, 55, 10]; // #1a0e00 at ~60%
const ALT_ROW_BG: [number, number, number] = [255, 251, 242]; // warm white

interface PdfExportOptions {
  /** Event title */
  title: string;
  /** Event slug (for filename) */
  slug: string;
  /** Column headers */
  headers: string[];
  /** Data rows (each row = array of strings matching headers) */
  rows: string[][];
  /** Optional subtitle (e.g. "Variant: Trail 30km") */
  subtitle?: string;
  /** Total registrations count */
  totalCount?: number;
  /**
   * Logo rendered as PNG data-URL (from a canvas that drew the SVG).
   * Passed in from the caller so this module stays sync.
   */
  logoPngDataUrl?: string | null;
}

/**
 * Generate and download a branded PDF report with the Athlifyr design.
 *
 * Features:
 * - Golden header bar matching the ticket modal (horizontal gradient #F5A623)
 * - Athlifyr logo covering the full header width
 * - Dark text on golden background — same as the ticket
 * - Auto-paginated table with alternating warm-white rows
 * - Footer with page numbers + generation date
 */
export function generateRegistrationsPDF(options: PdfExportOptions): void {
  const { title, slug, headers, rows, subtitle, totalCount, logoPngDataUrl } =
    options;

  const orientation = headers.length > 6 ? "landscape" : "portrait";
  const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const headerH = 18; // mm — compact golden header bar

  // ── Helper: draw the golden header on every page ──────────────────────────
  const drawPageHeader = (pageNum: number) => {
    // ── Golden header bar (solid) ────────────────────────────────────────────
    doc.setFillColor(...GOLDEN_LIGHT_RGB);
    doc.rect(0, 0, pageWidth, headerH, "F");

    // ── Logo image — left-aligned in the compact header ─────────────────────
    // 12mm tall fits well in an 18mm header (3mm padding top + bottom).
    // /public/logo.png is loaded directly — no SVG→canvas conversion needed.
    const LOGO_H = 12;
    const LOGO_W = LOGO_H * (766 / 754);
    if (logoPngDataUrl) {
      try {
        doc.addImage(
          logoPngDataUrl,
          "PNG",
          margin,
          (headerH - LOGO_H) / 2,
          LOGO_W,
          LOGO_H
        );
      } catch {
        // Silently skip logo errors
      }
    }

    // ── "ATHLIFYR" wordmark + date — dark text, top-right ────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...DARK_MUTED);
    doc.text("ATHLIFYR", pageWidth - margin, 5, { align: "right" });

    // Date + page number — dark, top-right
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...DARK_MUTED);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`${dateStr} • Página ${pageNum}`, pageWidth - margin, 10, {
      align: "right",
    });

    // ── Event title — offset to the right of the logo ───────────────────────
    const logoW = LOGO_W;
    const textX = logoPngDataUrl ? margin + logoW + 3 : margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...DARK_TEXT);
    doc.text(title, textX, 9);

    // Subtitle / total count — dark muted, below title
    let yPos = 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...DARK_MUTED);

    if (subtitle) {
      doc.text(subtitle, textX, yPos);
      yPos += 3;
    }
    if (totalCount !== undefined) {
      doc.text(`Total: ${totalCount}`, textX, yPos);
    }

    // ── Thin dark separator below header ────────────────────────────────────
    doc.setDrawColor(...DARK_TEXT);
    doc.setLineWidth(0.3);
    doc.line(0, headerH, pageWidth, headerH);
  };

  // ── First page ─────────────────────────────────────────────────────────────
  drawPageHeader(1);

  // ── Table ──────────────────────────────────────────────────────────────────
  const fontSize = headers.length > 10 ? 6 : headers.length > 7 ? 7 : 8;

  autoTable(doc, {
    startY: headerH + 4,
    head: [headers],
    body: rows,
    margin: { left: margin, right: margin },
    styles: {
      font: "helvetica",
      fontSize,
      cellPadding: 2.5,
      overflow: "linebreak",
      textColor: DARK_TEXT,
      lineColor: [220, 210, 190],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: GOLDEN_RGB,
      textColor: DARK_TEXT,
      fontStyle: "bold",
      fontSize: fontSize + 0.5,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: ALT_ROW_BG,
    },
    didDrawPage: (_data) => {
      const currentPage = doc.getCurrentPageInfo().pageNumber;
      if (currentPage > 1) {
        drawPageHeader(currentPage);
      }

      // ── Footer ──────────────────────────────────────────────────────────
      doc.setDrawColor(...GOLDEN_RGB);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...DARK_MUTED);
      doc.text(
        `Gerado por Athlifyr • ${new Date().toLocaleString()}`,
        margin,
        pageHeight - 6
      );
      doc.text(`Página ${currentPage}`, pageWidth - margin, pageHeight - 6, {
        align: "right",
      });
    },
  });

  // ── Save ───────────────────────────────────────────────────────────────────
  const datePart = new Date().toISOString().slice(0, 10);
  doc.save(`athlifyr-registrations-${slug}-${datePart}.pdf`);
}
