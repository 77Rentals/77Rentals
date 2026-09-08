// Shared plain-text-to-structure parser for our legal document templates
// (contract/NDA template strings). Heuristic, not a real parser: our
// generators always separate clauses with a blank line, indent sub-items
// with leading spaces, and write "Label: value" lines for details/signature
// blocks — this keys off those three conventions. Consumed by both
// DocumentText.tsx (renders to JSX) and pdfGenerator.ts (renders to PDF),
// so the two views can never drift apart.

export type DocRow =
  | { kind: 'paragraph'; text: string }
  | { kind: 'indented'; text: string }
  | { kind: 'labelValue'; label: string; value: string };

export type DocBlock =
  | { kind: 'title'; heading: string; subLines: string[] }
  | { kind: 'clause'; heading: string; rows: DocRow[] }
  | { kind: 'body'; rows: DocRow[] };

function isIndented(rawLine: string): boolean {
  return /^ {2,}/.test(rawLine);
}

function isLabelValueLine(line: string): boolean {
  // Require an uppercase start: our real "Label: value" lines always begin
  // with a capital (Nombre, C.C., EL PROPIETARIO...), whereas a justified
  // paragraph that happens to wrap right before a colon (e.g. "...la(s)" /
  // "siguiente(s) unidad(es):") is a lowercase mid-sentence continuation.
  if (!/^[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9.()/ -]{1,44}:(\s.*)?$/.test(line)) return false;

  // A real value (when present) starts with a capital, a digit, or a
  // symbol like "$" or "[" — never a lowercase word. That rules out
  // intro sentences like "EL PROPIETARIO se obliga a: (i) entregar..."
  // where the "label" is really the start of a full sentence.
  const value = line.slice(line.indexOf(':') + 1).trim();
  const firstLetter = value.match(/[A-Za-zÀ-ÿ]/)?.[0];
  return !firstLetter || firstLetter === firstLetter.toUpperCase();
}

function parseRows(rawLines: string[]): DocRow[] {
  const rows: DocRow[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length) {
      rows.push({ kind: 'paragraph', text: buffer.join(' ') });
      buffer = [];
    }
  };

  rawLines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;

    if (isIndented(raw)) {
      flush();
      rows.push({ kind: 'indented', text: line });
      return;
    }

    if (isLabelValueLine(line)) {
      flush();
      const idx = line.indexOf(':');
      rows.push({ kind: 'labelValue', label: line.slice(0, idx + 1), value: line.slice(idx + 1).trim() });
      return;
    }

    buffer.push(line);
  });
  flush();

  return rows;
}

export function parseDocument(text: string): DocBlock[] {
  const blocks = text
    .trim()
    .split(/\n\s*\n/)
    .map((b) => b.replace(/\n+$/, ''))
    .filter((b) => b.trim());

  return blocks.map((block, i): DocBlock => {
    const rawLines = block.split('\n');
    const first = rawLines[0].trim();

    if (i === 0) {
      return { kind: 'title', heading: first, subLines: rawLines.slice(1).map((l) => l.trim()) };
    }

    const isClauseHeading = /^CL[ÁA]USULA\s/i.test(first);
    if (isClauseHeading) {
      return { kind: 'clause', heading: first, rows: parseRows(rawLines.slice(1)) };
    }

    return { kind: 'body', rows: parseRows(rawLines) };
  });
}
