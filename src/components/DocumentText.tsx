// Renders one of our plain-text legal documents (contract/NDA template
// strings) as formatted, PDF-like HTML instead of a raw monospace dump.
// Parsing lives in lib/documentBlocks.ts, shared with the actual PDF export
// (lib/pdfGenerator.ts) so the two views can never drift apart.

import { parseDocument, type DocRow } from '@/lib/documentBlocks';

function renderRows(rows: DocRow[], keyPrefix: string) {
  return rows.map((row, i) => {
    if (row.kind === 'indented') {
      return (
        <div key={`${keyPrefix}-${i}`} className="pl-5 text-gray-700 mb-1">
          {row.text}
        </div>
      );
    }
    if (row.kind === 'labelValue') {
      return (
        <div key={`${keyPrefix}-${i}`} className="mb-1">
          <span className="font-semibold text-[#0B2545]">{row.label}</span>
          {row.value ? ' ' + row.value : ''}
        </div>
      );
    }
    return (
      <p key={`${keyPrefix}-${i}`} className="text-justify mb-1.5">
        {row.text}
      </p>
    );
  });
}

export function DocumentText({ text }: { text: string }) {
  const blocks = parseDocument(text);

  return (
    <div className="font-serif text-[13.5px] leading-relaxed text-gray-800">
      {blocks.map((block, i) => {
        if (block.kind === 'title') {
          return (
            <div key={i} className="text-center pb-3 mb-3 border-b-2 border-[#C9A24B]">
              <h2 className="text-[15px] font-bold text-[#0B2545] tracking-wide leading-snug">
                {block.heading}
              </h2>
              {block.subLines.map((l, j) => (
                <p key={j} className="text-[11px] text-gray-500 mt-0.5">
                  {l}
                </p>
              ))}
            </div>
          );
        }

        if (block.kind === 'clause') {
          return (
            <div key={i} className="mt-4 mb-2">
              <h3 className="font-bold text-[#0B2545] text-[13.5px] tracking-wide mb-1.5">
                {block.heading}
              </h3>
              {renderRows(block.rows, `b${i}`)}
            </div>
          );
        }

        return (
          <div key={i} className="mb-3">
            {renderRows(block.rows, `b${i}`)}
          </div>
        );
      })}
    </div>
  );
}
