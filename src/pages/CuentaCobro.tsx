import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Copy, Plus, Printer, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import logo from '@/assets/logo77.jpeg';
import { buildCuentaCobroText, CuentaCobroItem } from '@/lib/cuentaCobroFormat';
import { pesosToWords } from '@/lib/numberToWords';
import { formatCOP } from '@/lib/cotizacionFormat';

const DRAFT_KEY = 'cuentaCobro.draft';

const DEFAULT_PAYMENT_DETAILS = [
  '👤 Claudia Moreno Velosa',
  '🏦 Bancolombia',
  '💼 Cuenta de ahorros: 20444432854',
  '📲 Nequi: 304 673 6241',
  '🏦 Davivienda: 488 446 486 604 (ahorros)',
  '🔑 Llave Bancolombia: @claudia8523',
  '',
  '👤 Roberto Carlos Ruiz Gómez',
  '🏦 BBVA',
  '💼 Cuenta de ahorros: 0142274059',
].join('\n');

const CITIES = ['Cartagena', 'Bogotá', 'Santa Marta'];

interface FormState {
  numero: string;
  city: string;
  apartmentNote: string;
  clientName: string;
  clientId: string;
  issuerName: string;
  issuerId: string;
  nights: string;
  nightlyRate: string;
  cleaningFee: string;
  resortFee: string;
  extras: CuentaCobroItem[];
  paymentDetails: string;
}

const defaultState: FormState = {
  numero: '',
  city: 'Cartagena',
  apartmentNote: 'Ej: Murano Élite - Apto 3504',
  clientName: '',
  clientId: '',
  issuerName: 'Claudia Moreno Velosa',
  issuerId: '',
  nights: '5',
  nightlyRate: '320000',
  cleaningFee: '80000',
  resortFee: '67000',
  extras: [],
  paymentDetails: DEFAULT_PAYMENT_DETAILS,
};

export default function CuentaCobro() {
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);
    const previousTitle = document.title;
    document.title = 'Cuenta de Cobro — 77Rentals';
    return () => {
      document.head.removeChild(metaRobots);
      document.title = previousTitle;
    };
  }, []);

  const [state, setState] = useState<FormState>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
    } catch {
      return defaultState;
    }
  });
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  }, [state]);

  const update = (patch: Partial<FormState>) => setState((s) => ({ ...s, ...patch }));

  const addExtra = () => update({ extras: [...state.extras, { description: '', amount: 0 }] });
  const removeExtra = (index: number) => update({ extras: state.extras.filter((_, i) => i !== index) });
  const updateExtra = (index: number, patch: Partial<CuentaCobroItem>) =>
    update({ extras: state.extras.map((it, i) => (i === index ? { ...it, ...patch } : it)) });

  const nights = Number(state.nights) || 0;
  const nightlyRate = Number(state.nightlyRate) || 0;
  const cleaningFee = Number(state.cleaningFee) || 0;
  const resortFee = Number(state.resortFee) || 0;
  const hospedajeTotal = nights * nightlyRate;
  const extrasTotal = state.extras.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const total = hospedajeTotal + cleaningFee + resortFee + extrasTotal;

  const canGenerate = state.clientName && state.issuerName && state.issuerId && date && total > 0;

  const items: CuentaCobroItem[] = [
    ...(hospedajeTotal > 0
      ? [{ description: `Tarifa por noche (${nights} noches x $${formatCOP(nightlyRate)})`, amount: hospedajeTotal }]
      : []),
    ...(cleaningFee > 0 ? [{ description: 'Aseo de check-out', amount: cleaningFee }] : []),
    ...(resortFee > 0 ? [{ description: 'Registro del edificio / resort fee', amount: resortFee }] : []),
    ...state.extras.filter((it) => it.description && it.amount > 0),
  ];

  const cuentaData = canGenerate
    ? {
        numero: state.numero,
        city: state.city,
        date: format(date!, "d 'de' MMMM 'de' yyyy", { locale: es }),
        apartmentNote: state.apartmentNote,
        clientName: state.clientName,
        clientId: state.clientId,
        issuerName: state.issuerName,
        issuerId: state.issuerId,
        items,
        total,
        paymentDetails: state.paymentDetails,
      }
    : null;

  const previewText = cuentaData ? buildCuentaCobroText(cuentaData) : '';

  const handleCopy = async () => {
    if (!previewText) return;
    try {
      await navigator.clipboard.writeText(previewText);
      toast.success('Cuenta de cobro copiada');
    } catch {
      toast.error('No se pudo copiar. Selecciona el texto manualmente.');
    }
  };

  const handlePrint = () => window.print();

  const handleReset = () => {
    localStorage.removeItem(DRAFT_KEY);
    setState(defaultState);
    setDate(new Date());
  };

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4 print:bg-white print:p-0">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #cuenta-cobro-preview, #cuenta-cobro-preview * { visibility: visible; }
          #cuenta-cobro-preview { position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
      <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 print:block">
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Nueva cuenta de cobro
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" /> Limpiar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Número (opcional)</Label>
                <Input value={state.numero} onChange={(e) => update({ numero: e.target.value })} placeholder="Ej. 001" />
              </div>
              <div className="space-y-2">
                <Label>Ciudad</Label>
                <Select value={state.city} onValueChange={(v) => update({ city: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {date ? format(date, "d MMM yyyy", { locale: es }) : 'Selecciona fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Apartamento / Edificio (nota interna)</Label>
              <Input
                value={state.apartmentNote}
                onChange={(e) => update({ apartmentNote: e.target.value })}
                placeholder="Ej: Murano Élite - Apto 3504"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Cliente (quien paga)</Label>
                <Input value={state.clientName} onChange={(e) => update({ clientName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>C.C./NIT cliente (opcional)</Label>
                <Input value={state.clientId} onChange={(e) => update({ clientId: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Quien cobra</Label>
                <Input value={state.issuerName} onChange={(e) => update({ issuerName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>C.C. de quien cobra</Label>
                <Input value={state.issuerId} onChange={(e) => update({ issuerId: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Noches</Label>
                <Input type="number" value={state.nights} onChange={(e) => update({ nights: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Tarifa por noche</Label>
                <Input type="number" value={state.nightlyRate} onChange={(e) => update({ nightlyRate: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Aseo</Label>
                <Input type="number" value={state.cleaningFee} onChange={(e) => update({ cleaningFee: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Resort fee / registro</Label>
                <Input type="number" value={state.resortFee} onChange={(e) => update({ resortFee: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Extras (opcional)</Label>
              <div className="space-y-2">
                {state.extras.map((it, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Descripción"
                      value={it.description}
                      onChange={(e) => updateExtra(i, { description: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Valor"
                      className="w-40"
                      value={it.amount || ''}
                      onChange={(e) => updateExtra(i, { amount: Number(e.target.value) || 0 })}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeExtra(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addExtra}>
                  <Plus className="h-4 w-4 mr-1" /> Agregar extra
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Total</Label>
              <Input value={formatCOP(total)} disabled />
              {total > 0 && <p className="text-xs text-muted-foreground">{pesosToWords(total)}</p>}
            </div>

            <div className="space-y-2">
              <Label>Datos para pago</Label>
              <Textarea rows={8} value={state.paymentDetails} onChange={(e) => update({ paymentDetails: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="print:shadow-none print:border-none" id="cuenta-cobro-preview">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <span className="print:hidden">Vista previa</span>
                <img src={logo} alt="77 Rentals" className="h-10 w-auto object-contain ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {canGenerate ? (
                <pre className="whitespace-pre-wrap font-sans text-sm">{previewText}</pre>
              ) : (
                <p className="text-sm text-muted-foreground">Completa el formulario para ver la vista previa.</p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 print:hidden">
            <Button className="flex-1" onClick={handleCopy} disabled={!canGenerate}>
              <Copy className="h-4 w-4 mr-2" /> Copiar
            </Button>
            <Button variant="outline" className="flex-1" onClick={handlePrint} disabled={!canGenerate}>
              <Printer className="h-4 w-4 mr-2" /> Descargar / Imprimir PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
