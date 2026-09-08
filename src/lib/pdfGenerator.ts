// Renders one of our plain-text legal documents (contract/NDA) as an actual
// downloadable PDF, using the same block parser as the on-screen preview
// (lib/documentBlocks.ts) so the two views never drift apart.

import jsPDF from 'jspdf';
import { parseDocument, type DocRow } from './documentBlocks';

const NAVY = '#0B2545';
const GOLD = '#C9A24B';
const INK = '#1f2937';
const GREY = '#5B6570';

const PAGE_MARGIN_X = 56;
const PAGE_MARGIN_TOP = 46;
const PAGE_MARGIN_BOTTOM = 46;

export interface PdfSignature {
  /** e.g. "EL PROPIETARIO" or "77RENTALS" */
  roleLabel: string;
  signatureImage: string; // PNG data URL from the canvas signature pad
}

/** Builds the PDF and returns it as a Blob (does not trigger a download). */
export function buildDocumentPdf(documentText: string, signatures: PdfSignature[] = []): Blob {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN_X * 2;
  let y = PAGE_MARGIN_TOP;

  const addTopBand = () => {
    doc.setFillColor(NAVY);
    doc.rect(0, 0, pageWidth, 10, 'F');
    doc.setFillColor(GOLD);
    doc.rect(0, pageHeight - 7, pageWidth, 7, 'F');
  };
  addTopBand();

  const ensureSpace = (lineHeight: number) => {
    if (y + lineHeight > pageHeight - PAGE_MARGIN_BOTTOM) {
      doc.addPage();
      addTopBand();
      y = PAGE_MARGIN_TOP;
    }
  };

  const writeText = (
    text: string,
    opts: { fontSize?: number; bold?: boolean; color?: string; indent?: number; align?: 'left' | 'center' } = {}
  ) => {
    const fontSize = opts.fontSize ?? 9.5;
    const indent = opts.indent ?? 0;
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(opts.color ?? INK);
    const lines = doc.splitTextToSize(text, contentWidth - indent) as string[];
    const lineHeight = fontSize * 1.4;
    lines.forEach((line) => {
      ensureSpace(lineHeight);
      if (opts.align === 'center') {
        doc.text(line, pageWidth / 2, y, { align: 'center' });
      } else {
        doc.text(line, PAGE_MARGIN_X + indent, y);
      }
      y += lineHeight;
    });
  };

  const writeLabelValue = (label: string, value: string) => {
    const fontSize = 9.5;
    const lineHeight = fontSize * 1.4;
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    const labelWidth = doc.getTextWidth(label + ' ');
    ensureSpace(lineHeight);
    doc.setTextColor(NAVY);
    doc.text(label, PAGE_MARGIN_X, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(INK);
    const valueLines = value ? (doc.splitTextToSize(value, contentWidth - labelWidth) as string[]) : [];
    if (valueLines[0]) doc.text(valueLines[0], PAGE_MARGIN_X + labelWidth, y);
    y += lineHeight;
    for (let i = 1; i < valueLines.length; i++) {
      ensureSpace(lineHeight);
      doc.text(valueLines[i], PAGE_MARGIN_X, y);
      y += lineHeight;
    }
  };

  const writeRows = (rows: DocRow[]) => {
    rows.forEach((row) => {
      if (row.kind === 'indented') {
        writeText(row.text, { fontSize: 9, indent: 16 });
      } else if (row.kind === 'labelValue') {
        writeLabelValue(row.label, row.value);
      } else {
        writeText(row.text);
      }
    });
  };

  const blocks = parseDocument(documentText);

  blocks.forEach((block) => {
    if (block.kind === 'title') {
      writeText(block.heading, { fontSize: 13, bold: true, color: NAVY, align: 'center' });
      block.subLines.forEach((l) => writeText(l, { fontSize: 8.5, color: GREY, align: 'center' }));
      ensureSpace(14);
      doc.setDrawColor(GOLD);
      doc.setLineWidth(1.2);
      doc.line(PAGE_MARGIN_X, y, pageWidth - PAGE_MARGIN_X, y);
      y += 16;
      return;
    }

    if (block.kind === 'clause') {
      y += 6;
      writeText(block.heading, { fontSize: 10.5, bold: true, color: NAVY });
      y += 2;
      writeRows(block.rows);
      return;
    }

    writeRows(block.rows);
    y += 4;
  });

  // Drawn signature images, appended after the document text.
  if (signatures.length > 0) {
    ensureSpace(30);
    y += 10;
    doc.setDrawColor('#E2E2E2');
    doc.setLineWidth(0.6);
    doc.line(PAGE_MARGIN_X, y, pageWidth - PAGE_MARGIN_X, y);
    y += 20;

    const imgWidth = 180;
    const imgHeight = 60;
    const gap = 24;
    const totalWidth = signatures.length * imgWidth + (signatures.length - 1) * gap;
    let x = (pageWidth - totalWidth) / 2;

    ensureSpace(imgHeight + 24);
    signatures.forEach((sig) => {
      try {
        doc.addImage(sig.signatureImage, 'PNG', x, y, imgWidth, imgHeight);
      } catch {
        // Ignore malformed image data rather than failing the whole export.
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(GREY);
      doc.text(sig.roleLabel, x + imgWidth / 2, y + imgHeight + 14, { align: 'center' });
      x += imgWidth + gap;
    });
    y += imgHeight + 30;
  }

  return doc.output('blob');
}

/** Builds the PDF and triggers a browser download. */
export function downloadDocumentPdf(documentText: string, filename: string, signatures: PdfSignature[] = []): void {
  const blob = buildDocumentPdf(documentText, signatures);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
