import { formatCOP } from './cotizacionFormat';
import { pesosToWords } from './numberToWords';

export interface CuentaCobroItem {
  description: string;
  amount: number;
}

export interface CuentaCobroData {
  numero?: string;
  city: string;
  date: string;
  clientName: string;
  clientId?: string;
  issuerName: string;
  issuerId: string;
  items: CuentaCobroItem[];
  total: number;
  paymentDetails: string;
}

export function buildCuentaCobroText(d: CuentaCobroData): string {
  const lines: string[] = [
    `CUENTA DE COBRO${d.numero ? ` No. ${d.numero}` : ''}`,
    '',
    `${d.city}, ${d.date}`,
    '',
    'Señores',
    d.clientName,
    ...(d.clientId ? [`C.C./NIT: ${d.clientId}`] : []),
    '',
    `Debe a: ${d.issuerName}, identificado(a) con C.C. No. ${d.issuerId}`,
    '',
    `La suma de: ${pesosToWords(d.total)} ($${formatCOP(d.total)})`,
    '',
    'Por concepto de:',
  ];

  d.items.forEach((item) => {
    lines.push(`- ${item.description}: $${formatCOP(item.amount)}`);
  });

  lines.push('', `TOTAL: $${formatCOP(d.total)}`, '', 'Forma de pago:', d.paymentDetails, '', 'Cordialmente,', '', '_____________________', d.issuerName, `C.C. ${d.issuerId}`);

  return lines.join('\n');
}
