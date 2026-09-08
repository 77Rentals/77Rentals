// Renders one of our plain-text legal documents (contract/NDA template
// strings) as formatted, PDF-like HTML instead of a raw monospace dump.
// Heuristic, not a real parser: our generators always separate clauses with
// a blank line, indent sub-items with leading spaces, and write "Label:
// value" lines for details/signature blocks — this renderer keys off those
// three conventions.

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

function renderBody(rawLines: string[], keyPrefix: string) {
  const rendered: JSX.Element[] = [];
  let buffer: string[] = [];
  let bufferKey = 0;

  const flush = () => {
    if (buffer.length) {
      rendered.push(
        <p key={`${keyPrefix}-p-${bufferKey++}`} className="text-justify mb-1.5">
          {buffer.join(' ')}
        </p>
      );
      buffer = [];
    }
  };

  rawLines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;

    if (isIndented(raw)) {
      flush();
      rendered.push(
        <div key={`${keyPrefix}-i-${i}`} className="pl-5 text-gray-700 mb-1">
          {line}
        </div>
      );
      return;
    }

    if (isLabelValueLine(line)) {
      flush();
      const idx = line.indexOf(':');
      const label = line.slice(0, idx + 1);
      const value = line.slice(idx + 1).trim();
      rendered.push(
        <div key={`${keyPrefix}-kv-${i}`} className="mb-1">
          <span className="font-semibold text-[#0B2545]">{label}</span>
          {value ? ' ' + value : ''}
        </div>
      );
      return;
    }

    buffer.push(line);
  });
  flush();

  return rendered;
}

export function DocumentText({ text }: { text: string }) {
  const blocks = text
    .trim()
    .split(/\n\s*\n/)
    .map((b) => b.replace(/\n+$/, ''))
    .filter((b) => b.trim());

  return (
    <div className="font-serif text-[13.5px] leading-relaxed text-gray-800">
      {blocks.map((block, i) => {
        const rawLines = block.split('\n');
        const first = rawLines[0].trim();

        // The document's opening title + subtitle lines.
        if (i === 0) {
          return (
            <div key={i} className="text-center pb-3 mb-3 border-b-2 border-[#C9A24B]">
              <h2 className="text-[15px] font-bold text-[#0B2545] tracking-wide leading-snug">
                {first}
              </h2>
              {rawLines.slice(1).map((l, j) => (
                <p key={j} className="text-[11px] text-gray-500 mt-0.5">
                  {l.trim()}
                </p>
              ))}
            </div>
          );
        }

        const isClauseHeading = /^CL[ÁA]USULA\s/i.test(first);
        if (isClauseHeading) {
          return (
            <div key={i} className="mt-4 mb-2">
              <h3 className="font-bold text-[#0B2545] text-[13.5px] tracking-wide mb-1.5">
                {first}
              </h3>
              {renderBody(rawLines.slice(1), `b${i}`)}
            </div>
          );
        }

        return (
          <div key={i} className="mb-3">
            {renderBody(rawLines, `b${i}`)}
          </div>
        );
      })}
    </div>
  );
}
