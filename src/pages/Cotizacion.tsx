import { useEffect, useMemo, useState } from 'react';
import { differenceInCalendarDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Copy, Printer, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { apartments } from '@/data/apartments';
import logo from '@/assets/logo77.jpeg';
import { getThirdPartyProperties, saveThirdPartyProperty, ThirdPartyProperty } from '@/lib/thirdPartyProperties';
import { buildCotizacionText, formatCOP } from '@/lib/cotizacionFormat';

const DRAFT_KEY = 'cotizacion.draft';

interface FormState {
  source: 'own' | 'third-party';
  apartmentId: string;
  thirdPartyId: string;
  guestName: string;
  guestPhone: string;
  buildingName: string;
  apartmentNumber: string;
  featuredAmenity: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  guests: string;
  nightlyRate: string;
  cleaningFee: string;
  registrationFee: string;
  depositPercent: string;
  notes: string;
  validUntil: string;
  hostName: string;
  hostPhone: string;
  totalOverride: string | null;
}

const defaultState: FormState = {
  source: 'own',
  apartmentId: '',
  thirdPartyId: '',
  guestName: '',
  guestPhone: '',
  buildingName: '',
  apartmentNumber: '',
  featuredAmenity: '',
  checkInDate: '',
  checkInTime: '3:00 p. m.',
  checkOutDate: '',
  checkOutTime: '12:00 m.',
  guests: '2',
  nightlyRate: '',
  cleaningFee: '80000',
  registrationFee: '67000',
  depositPercent: '20',
  notes: '',
  validUntil: '',
  hostName: 'Claudia Moreno',
  hostPhone: '304 673 6241',
  totalOverride: null,
};

export default function Cotizacion() {
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);
    const previousTitle = document.title;
    document.title = 'Cotización — 77Rentals';
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
  const [thirdPartyList, setThirdPartyList] = useState<ThirdPartyProperty[]>([]);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();

  useEffect(() => {
    setThirdPartyList(getThirdPartyProperties());
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  }, [state]);

  const update = (patch: Partial<FormState>) => setState((s) => ({ ...s, ...patch }));

  const ownOptions = useMemo(() => apartments.filter((a) => a.id !== 'coming-soon'), []);

  const handleApartmentSelect = (id: string) => {
    const apt = ownOptions.find((a) => a.id === id);
    if (!apt) return;
    const amenity = apt.amenitiesDetail?.outdoors?.[0] || apt.amenitiesDetail?.other?.[0] || '';
    update({
      apartmentId: id,
      buildingName: apt.name,
      apartmentNumber: '',
      featuredAmenity: amenity,
      guests: String(apt.guests || state.guests),
    });
  };

  const handleThirdPartySelect = (id: string) => {
    const prop = thirdPartyList.find((p) => p.id === id);
    if (!prop) return;
    update({
      thirdPartyId: id,
      buildingName: prop.buildingName,
      apartmentNumber: prop.apartmentNumber,
      featuredAmenity: prop.featuredAmenity,
      nightlyRate: String(prop.nightlyRate),
    });
  };

  const nights = checkIn && checkOut ? Math.max(0, differenceInCalendarDays(checkOut, checkIn)) : 0;
  const nightlyRate = Number(state.nightlyRate) || 0;
  const cleaningFee = Number(state.cleaningFee) || 0;
  const registrationFee = Number(state.registrationFee) || 0;
  const hospedajeTotal = nights * nightlyRate;
  const computedTotal = hospedajeTotal + cleaningFee + registrationFee;
  const total = state.totalOverride !== null ? Number(state.totalOverride) : computedTotal;
  const depositPercent = Number(state.depositPercent) || 0;
  const depositAmount = (total * depositPercent) / 100;
  const remainingBalance = total - depositAmount;

  const canGenerate = state.guestName && state.buildingName && checkIn && checkOut && nights > 0 && nightlyRate > 0;

  const cotizacionData = canGenerate
    ? {
        guestName: state.guestName,
        guestPhone: state.guestPhone,
        buildingName: state.buildingName,
        apartmentNumber: state.apartmentNumber,
        featuredAmenity: state.featuredAmenity,
        checkInDate: format(checkIn!, "d 'de' MMMM", { locale: es }),
        checkInTime: state.checkInTime,
        checkOutDate: format(checkOut!, "d 'de' MMMM", { locale: es }),
        checkOutTime: state.checkOutTime,
        nights,
        guests: Number(state.guests) || 0,
        nightlyRate,
        hospedajeTotal,
        cleaningFee,
        registrationFee,
        total,
        depositPercent,
        depositAmount,
        remainingBalance,
        notes: state.notes,
        validUntil: state.validUntil,
        hostName: state.hostName,
        hostPhone: state.hostPhone,
      }
    : null;

  const previewText = cotizacionData ? buildCotizacionText(cotizacionData) : '';

  const handleCopy = async () => {
    if (!previewText) return;
    handleSaveThirdParty(true);
    try {
      await navigator.clipboard.writeText(previewText);
      toast.success('Cotización copiada — pégala en WhatsApp');
    } catch {
      toast.error('No se pudo copiar. Selecciona el texto manualmente.');
    }
  };

  const handleSaveThirdParty = (silent = false) => {
    if (state.source !== 'third-party' || !state.buildingName || !state.apartmentNumber) return;
    saveThirdPartyProperty({
      buildingName: state.buildingName,
      apartmentNumber: state.apartmentNumber,
      featuredAmenity: state.featuredAmenity,
      nightlyRate,
    });
    setThirdPartyList(getThirdPartyProperties());
    if (!silent) toast.success('Propiedad guardada para futuras cotizaciones');
  };

  const handlePrint = () => {
    handleSaveThirdParty(true);
    window.print();
  };

  const handleReset = () => {
    localStorage.removeItem(DRAFT_KEY);
    setState(defaultState);
    setCheckIn(undefined);
    setCheckOut(undefined);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4 print:bg-white print:p-0">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #cotizacion-preview, #cotizacion-preview * { visibility: visible; }
          #cotizacion-preview { position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
      <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 print:block">
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Nueva cotización
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" /> Limpiar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Origen de la propiedad</Label>
              <Select value={state.source} onValueChange={(v: 'own' | 'third-party') => update({ source: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="own">Nuestro (publicado en la web)</SelectItem>
                  <SelectItem value="third-party">De terceros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {state.source === 'own' ? (
              <div className="space-y-2">
                <Label>Apartamento</Label>
                <Select value={state.apartmentId} onValueChange={handleApartmentSelect}>
                  <SelectTrigger><SelectValue placeholder="Selecciona un apartamento" /></SelectTrigger>
                  <SelectContent>
                    {ownOptions.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              thirdPartyList.length > 0 && (
                <div className="space-y-2">
                  <Label>Propiedad guardada (opcional)</Label>
                  <Select value={state.thirdPartyId} onValueChange={handleThirdPartySelect}>
                    <SelectTrigger><SelectValue placeholder="Selecciona o escribe una nueva abajo" /></SelectTrigger>
                    <SelectContent>
                      {thirdPartyList.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.buildingName} — {p.apartmentNumber}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Edificio</Label>
                <Input value={state.buildingName} onChange={(e) => update({ buildingName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Apartamento</Label>
                <Input value={state.apartmentNumber} onChange={(e) => update({ apartmentNumber: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Amenidad destacada</Label>
              <Input value={state.featuredAmenity} onChange={(e) => update({ featuredAmenity: e.target.value })} />
            </div>

            {state.source === 'third-party' && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleSaveThirdParty()}
                disabled={!state.buildingName || !state.apartmentNumber}
              >
                Guardar propiedad para futuras cotizaciones
              </Button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Huésped</Label>
                <Input value={state.guestName} onChange={(e) => update({ guestName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Teléfono (opcional)</Label>
                <Input value={state.guestPhone} onChange={(e) => update({ guestPhone: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Check-in</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {checkIn ? format(checkIn, "d MMM yyyy", { locale: es }) : 'Selecciona fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                  </PopoverContent>
                </Popover>
                <Input className="mt-1" value={state.checkInTime} onChange={(e) => update({ checkInTime: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Check-out</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {checkOut ? format(checkOut, "d MMM yyyy", { locale: es }) : 'Selecciona fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => !!checkIn && d <= checkIn} initialFocus />
                  </PopoverContent>
                </Popover>
                <Input className="mt-1" value={state.checkOutTime} onChange={(e) => update({ checkOutTime: e.target.value })} />
              </div>
            </div>
            {checkIn && checkOut && nights <= 0 && (
              <p className="text-sm text-destructive">El check-out debe ser posterior al check-in.</p>
            )}
            <p className="text-sm text-muted-foreground">Noches calculadas: <strong>{nights}</strong></p>

            <div className="space-y-2">
              <Label>Huéspedes</Label>
              <Input type="number" value={state.guests} onChange={(e) => update({ guests: e.target.value })} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Tarifa/noche</Label>
                <Input type="number" value={state.nightlyRate} onChange={(e) => update({ nightlyRate: e.target.value, totalOverride: null })} />
              </div>
              <div className="space-y-2">
                <Label>Aseo</Label>
                <Input type="number" value={state.cleaningFee} onChange={(e) => update({ cleaningFee: e.target.value, totalOverride: null })} />
              </div>
              <div className="space-y-2">
                <Label>Registro edificio</Label>
                <Input type="number" value={state.registrationFee} onChange={(e) => update({ registrationFee: e.target.value, totalOverride: null })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Total de la reserva {state.totalOverride !== null && <span className="text-xs text-amber-600 ml-2">(editado manualmente — <button type="button" className="underline" onClick={() => update({ totalOverride: null })}>recalcular</button>)</span>}</Label>
              <Input type="number" value={total} onChange={(e) => update({ totalOverride: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Anticipo mínimo (%)</Label>
              <Input type="number" value={state.depositPercent} onChange={(e) => update({ depositPercent: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Notas adicionales (opcional)</Label>
              <Textarea value={state.notes} onChange={(e) => update({ notes: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Anfitrión</Label>
                <Input value={state.hostName} onChange={(e) => update({ hostName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Teléfono anfitrión</Label>
                <Input value={state.hostPhone} onChange={(e) => update({ hostPhone: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="print:shadow-none print:border-none" id="cotizacion-preview">
            <CardHeader>
              <CardTitle className="text-primary">Vista previa</CardTitle>
            </CardHeader>
            <CardContent>
              {canGenerate ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="text-lg font-semibold">🏖️ Cotización de Hospedaje</p>
                      <p className="text-sm text-muted-foreground">77Rentals</p>
                    </div>
                    <img src={logo} alt="77 Rentals" className="h-12 w-auto object-contain" />
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <span className="text-muted-foreground">Huésped</span><span className="text-right font-medium">{state.guestName}</span>
                    <span className="text-muted-foreground">Edificio</span><span className="text-right font-medium">{state.buildingName}</span>
                    <span className="text-muted-foreground">Apartamento</span><span className="text-right font-medium">{state.apartmentNumber}</span>
                    {state.featuredAmenity && (<><span className="text-muted-foreground">Amenidad</span><span className="text-right font-medium">{state.featuredAmenity}</span></>)}
                    <span className="text-muted-foreground">Check-in</span><span className="text-right font-medium">{cotizacionData?.checkInDate} · {state.checkInTime}</span>
                    <span className="text-muted-foreground">Check-out</span><span className="text-right font-medium">{cotizacionData?.checkOutDate} · {state.checkOutTime}</span>
                    <span className="text-muted-foreground">Noches</span><span className="text-right font-medium">{nights}</span>
                    <span className="text-muted-foreground">Huéspedes</span><span className="text-right font-medium">{state.guests}</span>
                  </div>
                  <div className="border-t pt-3 space-y-1 text-sm">
                    <div className="flex justify-between"><span>Hospedaje ({nights} × ${formatCOP(nightlyRate)})</span><span>${formatCOP(hospedajeTotal)}</span></div>
                    {cleaningFee > 0 && <div className="flex justify-between"><span>Aseo de check-out</span><span>${formatCOP(cleaningFee)}</span></div>}
                    {registrationFee > 0 && <div className="flex justify-between"><span>Registro del edificio</span><span>${formatCOP(registrationFee)}</span></div>}
                    <div className="flex justify-between font-semibold text-base pt-2 border-t"><span>Total</span><span>${formatCOP(total)}</span></div>
                  </div>
                  <div className="border-t pt-3 space-y-1 text-sm">
                    <div className="flex justify-between"><span>Anticipo mínimo ({depositPercent}%)</span><span>${formatCOP(depositAmount)}</span></div>
                    <div className="flex justify-between"><span>Saldo restante</span><span>${formatCOP(remainingBalance)}</span></div>
                  </div>
                  <div className="border-t pt-3 space-y-2 text-sm">
                    <p className="font-medium">💳 Datos para pago</p>
                    <div>
                      <p>👤 Claudia Moreno Velosa</p>
                      <p className="text-muted-foreground">🏦 Bancolombia · Ahorros: 20444432854</p>
                      <p className="text-muted-foreground">📲 Nequi: 304 673 6241</p>
                      <p className="text-muted-foreground">🏦 Davivienda: 488 446 486 604 (ahorros)</p>
                      <p className="text-muted-foreground">🔑 Llave Bancolombia: @claudia8523</p>
                    </div>
                    <div>
                      <p>👤 Roberto Carlos Ruiz Gómez</p>
                      <p className="text-muted-foreground">🏦 BBVA · Ahorros: 0142274059</p>
                    </div>
                    <p className="text-muted-foreground">💳✨ Hazme saber si requieres el link para pago con tarjeta de crédito.</p>
                  </div>
                  {state.notes && <p className="text-sm text-muted-foreground border-t pt-3">{state.notes}</p>}
                  <div className="border-t pt-3 text-sm">
                    <p>{state.hostName}</p>
                    <p className="text-muted-foreground">77Rentals · {state.hostPhone}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Completa el formulario para ver la vista previa.</p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 print:hidden">
            <Button className="flex-1" onClick={handleCopy} disabled={!canGenerate}>
              <Copy className="h-4 w-4 mr-2" /> Copiar para WhatsApp
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
