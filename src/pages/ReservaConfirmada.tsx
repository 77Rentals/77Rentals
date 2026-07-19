import { useEffect, useMemo, useState } from 'react';
import { differenceInCalendarDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Check, ChevronsUpDown, Copy, Plus, Printer, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { apartments } from '@/data/apartments';
import logo from '@/assets/logo77.jpeg';
import { getBuildings, saveBuildingApartment, saveBuildingDetails, ThirdPartyBuilding } from '@/lib/thirdPartyBuildings';
import { getOwnOverride, saveOwnOverride } from '@/lib/ownApartmentOverrides';
import { buildReservaConfirmadaText, GuestEntry } from '@/lib/reservaConfirmadaFormat';
import { formatCOP } from '@/lib/cotizacionFormat';

const DRAFT_KEY = 'reserva.draft';
export const HANDOFF_KEY = 'reserva.handoff';

interface FormState {
  source: 'own' | 'third-party';
  apartmentId: string;
  apartmentUnitId: string;
  apartmentUnitName: string;
  buildingName: string;
  apartmentNumber: string;
  apartmentNickname: string;
  includedText: string;
  buildingAmenitiesText: string;
  neighborhoodText: string;
  liaisonName: string;
  liaisonPhone: string;
  reservationHolderName: string;
  guests: GuestEntry[];
  guestFreeTextMode: boolean;
  guestFreeText: string;
  checkInTime: string;
  checkOutTime: string;
  guestsCount: string;
  nightlyRate: string;
  cleaningFee: string;
  registrationFee: string;
  totalOverride: string | null;
  depositPercent: string;
  depositConfirmedDate: string;
  hostName: string;
  hostPhone: string;
}

const defaultState: FormState = {
  source: 'own',
  apartmentId: '',
  apartmentUnitId: '',
  apartmentUnitName: '',
  buildingName: '',
  apartmentNumber: '',
  apartmentNickname: '',
  includedText: '',
  buildingAmenitiesText: '',
  neighborhoodText: '',
  liaisonName: '',
  liaisonPhone: '',
  reservationHolderName: '',
  guests: [{ name: '', idNumber: '' }],
  guestFreeTextMode: false,
  guestFreeText: '',
  checkInTime: '3:00 p. m.',
  checkOutTime: '12:00 m.',
  guestsCount: '2',
  nightlyRate: '',
  cleaningFee: '80000',
  registrationFee: '67000',
  totalOverride: null,
  depositPercent: '20',
  depositConfirmedDate: '',
  hostName: 'Claudia Moreno',
  hostPhone: '304 673 6241',
};

interface HandoffPayload {
  v: 1;
  source: 'own' | 'third-party';
  apartmentId: string;
  apartmentUnitId: string;
  apartmentUnitName: string;
  buildingName: string;
  apartmentNumber: string;
  reservationHolderName: string;
  guestsCount: string;
  checkIn: string | null;
  checkOut: string | null;
  checkInTime: string;
  checkOutTime: string;
  nightlyRate: string;
  cleaningFee: string;
  registrationFee: string;
  depositPercent: string;
}

function loadInitialState(): { state: FormState; checkIn?: Date; checkOut?: Date } {
  try {
    const handoffRaw = localStorage.getItem(HANDOFF_KEY);
    if (handoffRaw) {
      const payload: HandoffPayload = JSON.parse(handoffRaw);
      if (payload.v === 1) {
        return {
          state: {
            ...defaultState,
            source: payload.source,
            apartmentId: payload.apartmentId,
            apartmentUnitId: payload.apartmentUnitId,
            apartmentUnitName: payload.apartmentUnitName,
            buildingName: payload.buildingName,
            apartmentNumber: payload.apartmentNumber,
            reservationHolderName: payload.reservationHolderName,
            guestsCount: payload.guestsCount,
            checkInTime: payload.checkInTime,
            checkOutTime: payload.checkOutTime,
            nightlyRate: payload.nightlyRate,
            cleaningFee: payload.cleaningFee,
            registrationFee: payload.registrationFee,
            depositPercent: payload.depositPercent,
          },
          checkIn: payload.checkIn ? new Date(payload.checkIn) : undefined,
          checkOut: payload.checkOut ? new Date(payload.checkOut) : undefined,
        };
      }
    }
  } catch {
    // fall through to draft
  }
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return { state: raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState };
  } catch {
    return { state: defaultState };
  }
}

export default function ReservaConfirmada() {
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);
    const previousTitle = document.title;
    document.title = 'Reserva Confirmada — 77Rentals';
    return () => {
      document.head.removeChild(metaRobots);
      document.title = previousTitle;
    };
  }, []);

  const initial = useMemo(loadInitialState, []);
  const [state, setState] = useState<FormState>(initial.state);
  const [checkIn, setCheckIn] = useState<Date | undefined>(initial.checkIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(initial.checkOut);
  const [buildings, setBuildings] = useState<ThirdPartyBuilding[]>([]);
  const [buildingPickerOpen, setBuildingPickerOpen] = useState(false);

  useEffect(() => {
    setBuildings(getBuildings());
    localStorage.removeItem(HANDOFF_KEY);
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  }, [state]);

  const update = (patch: Partial<FormState>) => setState((s) => ({ ...s, ...patch }));

  const ownOptions = useMemo(() => apartments.filter((a) => a.id !== 'coming-soon'), []);

  const handleApartmentSelect = (id: string) => {
    const apt = ownOptions.find((a) => a.id === id);
    if (!apt) return;
    const override = getOwnOverride(id);
    update({
      apartmentId: id,
      buildingName: apt.name,
      apartmentNumber: '',
      guestsCount: String(apt.guests || state.guestsCount),
      apartmentNickname: override?.apartmentNickname || '',
      includedText: override?.includedText || '',
      buildingAmenitiesText: override?.buildingAmenitiesText || '',
      neighborhoodText: override?.neighborhoodText || '',
      liaisonName: override?.liaisonName || '',
      liaisonPhone: override?.liaisonPhone || '',
    });
  };

  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.name.trim().toLowerCase() === state.buildingName.trim().toLowerCase()),
    [buildings, state.buildingName]
  );

  const handleBuildingSelect = (building: ThirdPartyBuilding) => {
    update({
      buildingName: building.name,
      apartmentUnitId: '',
      apartmentUnitName: '',
      apartmentNumber: '',
      apartmentNickname: '',
      includedText: '',
      nightlyRate: '',
      buildingAmenitiesText: building.buildingAmenitiesText || '',
      neighborhoodText: building.neighborhoodText || '',
      liaisonName: building.liaisonName || '',
      liaisonPhone: building.liaisonPhone || '',
    });
    setBuildingPickerOpen(false);
  };

  const handleApartmentUnitSelect = (unitId: string) => {
    const unit = selectedBuilding?.apartments.find((a) => a.id === unitId);
    if (!unit) return;
    update({
      apartmentUnitId: unit.id,
      apartmentUnitName: unit.name,
      apartmentNumber: unit.apartmentNumber,
      apartmentNickname: unit.apartmentNickname || '',
      includedText: unit.includedText || '',
      nightlyRate: String(unit.nightlyRate),
    });
  };

  const handleSaveApartmentDetails = () => {
    if (!state.buildingName || !state.apartmentNumber) return;
    if (state.source === 'third-party') {
      const { apartment } = saveBuildingApartment(state.buildingName, {
        id: state.apartmentUnitId || undefined,
        name: state.apartmentUnitName || state.apartmentNumber,
        apartmentNumber: state.apartmentNumber,
        featuredAmenity: '',
        nightlyRate: Number(state.nightlyRate) || 0,
        apartmentNickname: state.apartmentNickname,
        includedText: state.includedText,
      });
      saveBuildingDetails(state.buildingName, {
        buildingAmenitiesText: state.buildingAmenitiesText,
        neighborhoodText: state.neighborhoodText,
        liaisonName: state.liaisonName,
        liaisonPhone: state.liaisonPhone,
      });
      setBuildings(getBuildings());
      update({ apartmentUnitId: apartment.id, apartmentUnitName: apartment.name });
    } else if (state.apartmentId) {
      saveOwnOverride({
        apartmentId: state.apartmentId,
        apartmentNickname: state.apartmentNickname,
        includedText: state.includedText,
        buildingAmenitiesText: state.buildingAmenitiesText,
        neighborhoodText: state.neighborhoodText,
        liaisonName: state.liaisonName,
        liaisonPhone: state.liaisonPhone,
      });
    }
    toast.success('Detalles guardados en la ficha del apartamento/edificio');
  };

  const addGuest = () => update({ guests: [...state.guests, { name: '', idNumber: '' }] });
  const removeGuest = (index: number) => update({ guests: state.guests.filter((_, i) => i !== index) });
  const updateGuest = (index: number, patch: Partial<GuestEntry>) =>
    update({ guests: state.guests.map((g, i) => (i === index ? { ...g, ...patch } : g)) });

  const toggleFreeText = (on: boolean) => {
    if (on) {
      const starter = state.guests
        .filter((g) => g.name)
        .map((g, i) => `${i + 1}. ${g.name}${g.idNumber ? ` – C.C. ${g.idNumber}` : ''}`)
        .join('\n');
      update({ guestFreeTextMode: true, guestFreeText: state.guestFreeText || starter });
    } else {
      update({ guestFreeTextMode: false });
    }
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

  const canGenerate =
    state.reservationHolderName && state.buildingName && checkIn && checkOut && nights > 0 && nightlyRate > 0;

  const reservaData = canGenerate
    ? {
        reservationHolderName: state.reservationHolderName,
        guests: state.guests.filter((g) => g.name),
        guestsFreeText: state.guestFreeTextMode ? state.guestFreeText : undefined,
        buildingName: state.buildingName,
        apartmentNumber: state.apartmentNumber,
        apartmentNickname: state.apartmentNickname,
        checkInDate: format(checkIn!, "d 'de' MMMM", { locale: es }),
        checkInTime: state.checkInTime,
        checkOutDate: format(checkOut!, "d 'de' MMMM", { locale: es }),
        checkOutTime: state.checkOutTime,
        nights,
        guestsCount: Number(state.guestsCount) || 0,
        nightlyRate,
        hospedajeTotal,
        cleaningFee,
        registrationFee,
        total,
        depositAmount,
        depositConfirmedDate: state.depositConfirmedDate || format(new Date(), "d 'de' MMMM", { locale: es }),
        remainingBalance,
        includedText: state.includedText,
        buildingAmenitiesText: state.buildingAmenitiesText,
        neighborhoodText: state.neighborhoodText,
        hostName: state.hostName,
        hostPhone: state.hostPhone,
        liaisonName: state.liaisonName,
        liaisonPhone: state.liaisonPhone,
      }
    : null;

  const previewText = reservaData ? buildReservaConfirmadaText(reservaData) : '';

  const handleCopy = async () => {
    if (!previewText) return;
    try {
      await navigator.clipboard.writeText(previewText);
      toast.success('Reserva confirmada copiada — pégala en el correo');
    } catch {
      toast.error('No se pudo copiar. Selecciona el texto manualmente.');
    }
  };

  const handlePrint = () => window.print();

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
          #reserva-preview, #reserva-preview * { visibility: visible; }
          #reserva-preview { position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
      <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 print:block">
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Reserva confirmada
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
              <>
                <div className="space-y-2">
                  <Label>Edificio</Label>
                  <Popover open={buildingPickerOpen} onOpenChange={setBuildingPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" role="combobox" className="w-full justify-between font-normal">
                        {state.buildingName || 'Busca o escribe un edificio'}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Buscar o escribir edificio..."
                          value={state.buildingName}
                          onValueChange={(v) => update({ buildingName: v, apartmentUnitId: '' })}
                        />
                        <CommandList>
                          <CommandEmpty>No hay edificios guardados con ese nombre.</CommandEmpty>
                          <CommandGroup>
                            {buildings.map((b) => (
                              <CommandItem key={b.id} value={b.name} onSelect={() => handleBuildingSelect(b)}>
                                <Check className={cn('mr-2 h-4 w-4', state.buildingName === b.name ? 'opacity-100' : 'opacity-0')} />
                                {b.name}
                                <span className="ml-auto text-xs text-muted-foreground">{b.apartments.length} apto(s)</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          {state.buildingName.trim() &&
                            !buildings.some((b) => b.name.trim().toLowerCase() === state.buildingName.trim().toLowerCase()) && (
                              <CommandGroup>
                                <CommandItem value={`__new__${state.buildingName}`} onSelect={() => setBuildingPickerOpen(false)}>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Agregar "{state.buildingName}" como edificio nuevo
                                </CommandItem>
                              </CommandGroup>
                            )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {selectedBuilding && selectedBuilding.apartments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Apartamento guardado (opcional)</Label>
                    <Select value={state.apartmentUnitId} onValueChange={handleApartmentUnitSelect}>
                      <SelectTrigger><SelectValue placeholder="Selecciona o escribe uno nuevo abajo" /></SelectTrigger>
                      <SelectContent>
                        {selectedBuilding.apartments.map((a) => (
                          <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              {state.source === 'third-party' && (
                <div className="space-y-2">
                  <Label>Nombre del apartamento</Label>
                  <Input
                    placeholder="Ej. Vista al mar"
                    value={state.apartmentUnitName}
                    onChange={(e) =>
                      update({ apartmentUnitId: '', apartmentUnitName: e.target.value, apartmentNickname: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Apartamento</Label>
                <Input value={state.apartmentNumber} onChange={(e) => update({ apartmentNumber: e.target.value, apartmentUnitId: '' })} />
              </div>
              {state.source === 'own' && (
                <div className="space-y-2">
                  <Label>Edificio</Label>
                  <Input value={state.buildingName} onChange={(e) => update({ buildingName: e.target.value })} />
                </div>
              )}
            </div>

            {state.source === 'own' && (
              <div className="space-y-2">
                <Label>Apodo del apartamento (opcional)</Label>
                <Input
                  placeholder="Ej. Vista al mar"
                  value={state.apartmentNickname}
                  onChange={(e) => update({ apartmentNickname: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>El apartamento incluye</Label>
              <Textarea
                rows={4}
                placeholder="Descripción de amenidades, toallas, jabón, café de bienvenida, etc."
                value={state.includedText}
                onChange={(e) => update({ includedText: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Amenidades del edificio</Label>
              <Textarea
                rows={3}
                placeholder="Piscina, gimnasio, jacuzzi, etc."
                value={state.buildingAmenitiesText}
                onChange={(e) => update({ buildingAmenitiesText: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Ubicación / barrio</Label>
              <Textarea
                rows={2}
                placeholder="Descripción del sector, cercanía a la playa, etc."
                value={state.neighborhoodText}
                onChange={(e) => update({ neighborhoodText: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Co-Host del edificio</Label>
                <Input value={state.liaisonName} onChange={(e) => update({ liaisonName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Teléfono co-host</Label>
                <Input value={state.liaisonPhone} onChange={(e) => update({ liaisonPhone: e.target.value })} />
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSaveApartmentDetails}
              disabled={!state.buildingName || !state.apartmentNumber}
            >
              Guardar en la ficha del edificio/apartamento
            </Button>

            <div className="space-y-2">
              <Label>Titular de la reserva</Label>
              <Input value={state.reservationHolderName} onChange={(e) => update({ reservationHolderName: e.target.value })} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Huéspedes</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Editar como texto libre</span>
                  <Switch checked={state.guestFreeTextMode} onCheckedChange={toggleFreeText} />
                </div>
              </div>
              {state.guestFreeTextMode ? (
                <Textarea
                  rows={5}
                  value={state.guestFreeText}
                  onChange={(e) => update({ guestFreeText: e.target.value })}
                />
              ) : (
                <div className="space-y-2">
                  {state.guests.map((g, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        placeholder="Nombre completo"
                        value={g.name}
                        onChange={(e) => updateGuest(i, { name: e.target.value })}
                      />
                      <Input
                        placeholder="C.C."
                        value={g.idNumber}
                        onChange={(e) => updateGuest(i, { idNumber: e.target.value })}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeGuest(i)} disabled={state.guests.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addGuest}>
                    <Plus className="h-4 w-4 mr-1" /> Agregar huésped
                  </Button>
                </div>
              )}
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
              <Label>Huéspedes (cantidad)</Label>
              <Input type="number" value={state.guestsCount} onChange={(e) => update({ guestsCount: e.target.value })} />
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
              <Label>
                Total de la reserva{' '}
                {state.totalOverride !== null && (
                  <span className="text-xs text-amber-600 ml-2">
                    (editado manualmente — <button type="button" className="underline" onClick={() => update({ totalOverride: null })}>recalcular</button>)
                  </span>
                )}
              </Label>
              <Input type="number" value={total} onChange={(e) => update({ totalOverride: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Anticipo (%)</Label>
                <Input type="number" value={state.depositPercent} onChange={(e) => update({ depositPercent: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Anticipo confirmado el</Label>
                <Input
                  placeholder="Ej. 18 de julio"
                  value={state.depositConfirmedDate}
                  onChange={(e) => update({ depositConfirmedDate: e.target.value })}
                />
              </div>
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
          <Card className="print:shadow-none print:border-none" id="reserva-preview">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-primary">
                Vista previa
                <img src={logo} alt="77 Rentals" className="h-10 w-auto object-contain" />
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
              <Copy className="h-4 w-4 mr-2" /> Copiar para correo
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
