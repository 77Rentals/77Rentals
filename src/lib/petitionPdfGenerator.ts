// Renders a multi-signer petition (document text + every collected
// signature row) as one downloadable PDF: the document body via the same
// block parser used everywhere else (lib/documentBlocks.ts), followed by a
// paginated table of all signers with their drawn signatures, built with
// jspdf-autotable since the single-signer generator's fixed bottom-row
// layout doesn't scale to 100+ signatures.

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { parseDocument, type DocRow } from './documentBlocks';
import type { Petition, PetitionSignature } from '@/data/petition';

const NAVY = '#0B2545';
const GOLD = '#C9A24B';
const INK = '#1f2937';
const GREY = '#5B6570';

const PAGE_MARGIN_X = 56;
const PAGE_MARGIN_TOP = 46;
const PAGE_MARGIN_BOTTOM = 46;

export function buildPetitionPdf(petition: Petition, signatures: PetitionSignature[]): Blob {
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

  parseDocument(petition.documentText).forEach((block) => {
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

  // Summary line before the signature table.
  y += 10;
  ensureSpace(20);
  writeText(
    `Total de firmas recolectadas: ${signatures.length}  ·  Coeficiente acumulado: ${petition.totalCoefficientPct.toFixed(3)}%  ·  ` +
      `Umbral requerido: ${petition.thresholdPct}%  ·  ${
        petition.totalCoefficientPct >= petition.thresholdPct ? 'UMBRAL CUMPLIDO' : 'Umbral aún no alcanzado'
      }`,
    { bold: true, color: NAVY }
  );
  y += 6;

  // Signature table — new page, since autoTable manages its own pagination
  // independently of the manual `y` tracking above.
  doc.addPage();
  addTopBand();

  const SIG_IMG_WIDTH = 60;
  const SIG_IMG_HEIGHT = 20;

  autoTable(doc, {
    startY: PAGE_MARGIN_TOP,
    margin: { left: PAGE_MARGIN_X, right: PAGE_MARGIN_X, top: PAGE_MARGIN_TOP, bottom: PAGE_MARGIN_BOTTOM },
    head: [['Unidad', 'Nombre', 'Cédula', 'Coef. %', 'Medio', 'Fecha', 'Firma']],
    body: signatures.map((s) => [
      s.unitNumber,
      s.signerName,
      s.signerIdNumber ?? '',
      s.coefficientPct === null ? '—' : s.coefficientPct.toFixed(3),
      s.consentMethod,
      s.signedAt.toLocaleDateString('es-CO'),
      '',
    ]),
    styles: { fontSize: 7.5, cellPadding: 4, valign: 'middle', textColor: INK },
    headStyles: { fillColor: [11, 37, 69], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [246, 246, 246] },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 110 },
      2: { cellWidth: 60 },
      3: { cellWidth: 45 },
      4: { cellWidth: 100 },
      5: { cellWidth: 55 },
      6: { cellWidth: SIG_IMG_WIDTH + 10, minCellHeight: SIG_IMG_HEIGHT + 8 },
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 6) {
        const sig = signatures[data.row.index];
        if (sig?.signatureImage) {
          try {
            doc.addImage(
              sig.signatureImage,
              'PNG',
              data.cell.x + 4,
              data.cell.y + (data.cell.height - SIG_IMG_HEIGHT) / 2,
              SIG_IMG_WIDTH,
              SIG_IMG_HEIGHT
            );
          } catch {
            // Ignore malformed image data rather than failing the whole export.
          }
        }
      }
    },
  });

  return doc.output('blob');
}

export function downloadPetitionPdf(petition: Petition, signatures: PetitionSignature[], filename: string): void {
  const blob = buildPetitionPdf(petition, signatures);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
