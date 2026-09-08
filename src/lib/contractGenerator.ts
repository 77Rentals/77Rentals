import type { GuestRequirement, PartnershipResponse, ContractSignature } from '@/data/partnerHub';

const ARRENDATARIO_NAME = 'ROBERTO CARLOS RUIZ GÓMEZ';
const ARRENDATARIO_ID = 'C.C. 79.719.972';
const ARRENDATARIO_BRAND = '77RENTALS';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function formatCOP(value: number): string {
  return `COP ${Math.round(value).toLocaleString('es-CO')}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-CO');
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Generates the full "Contrato de Servicio de Alquiler Turístico de Inmueble" between 77Rentals
 * (EL ARRENDATARIO) and the apartment owner (EL PROPIETARIO) for one accepted
 * Partner Hub offer. Generic by design — all dates/amounts are derived from
 * the requirement/offer, no hardcoded client-specific terms.
 */
export function generateContractTemplate(
  requirement: GuestRequirement,
  response: PartnershipResponse,
  adminName?: string,
  adminSignature?: ContractSignature,
  ownerSignature?: ContractSignature
): string {
  const checkIn = new Date(requirement.checkInDate + 'T00:00:00');
  const checkOut = new Date(requirement.checkOutDate + 'T00:00:00');
  const checkInDate = formatDate(checkIn);
  const checkOutDate = formatDate(checkOut);
  const now = new Date();
  const today = formatDate(now);
  const nightCount = Math.max(
    1,
    Math.ceil(
      (new Date(requirement.checkOutDate).getTime() - new Date(requirement.checkInDate).getTime()) /
        MS_PER_DAY
    )
  );

  // Economics — derived entirely from the accepted offer.
  // response.commissionAmount is stored PER NIGHT for the 10%-deduction
  // model (it's 10% of the nightly rate, from calculateCommission() in
  // OwnerResponseForm.tsx) but as a flat TOTAL for the markup model — the
  // same inconsistency the admin pricing breakdown already works around
  // (AdminOfferDetailModal.tsx). Recompute the true total commission here
  // rather than trusting the stored field directly, or a multi-night
  // contract understates what 77Rentals actually retains from the owner.
  const nightlyRate = response.proposedPrice;
  const cleaningFee = response.cleaningFee || 0;
  const lodgingTotal = nightlyRate * nightCount;
  const commissionPercent = response.commissionPercent || 0;
  const commissionAmount =
    commissionPercent > 0 ? lodgingTotal * (commissionPercent / 100) : response.commissionAmount || 0;
  const contractTotal = lodgingTotal + cleaningFee; // valor bruto del contrato
  const ownerNetTotal = contractTotal - commissionAmount; // neto a favor de EL PROPIETARIO
  const pay10 = ownerNetTotal * 0.1;
  const pay40 = ownerNetTotal * 0.4;
  const pay50 = ownerNetTotal * 0.5;

  // Payment calendar — relative to check-in, collapsing if signed late
  const daysToCheckIn = Math.ceil((checkIn.getTime() - now.getTime()) / MS_PER_DAY);
  const secondDueDays = 15; // 40% due no later than 15 calendar days before check-in
  const thirdDueDays = 3; // 50% due no later than 3 business days before check-in
  const secondDueDate = formatDate(addDays(checkIn, -secondDueDays));
  const thirdDueDate = formatDate(addDays(checkIn, -thirdDueDays));
  const secondDueText =
    daysToCheckIn > secondDueDays
      ? `a más tardar el ${secondDueDate} (${secondDueDays} días calendario antes del check-in)`
      : 'a la firma del presente contrato, por haberse perfeccionado con menos de 15 días de antelación al check-in';
  const thirdDueText =
    daysToCheckIn > thirdDueDays
      ? `a más tardar el ${thirdDueDate} (${thirdDueDays} días hábiles antes del check-in)`
      : 'a la firma del presente contrato, por haberse perfeccionado con menos de 3 días hábiles de antelación al check-in';

  // Signature lines — fill in actual name + ID + date if already signed, otherwise blank
  const adminSigName = adminSignature ? adminSignature.signerName : '___________________________';
  const adminSigId = adminSignature ? adminSignature.signerIdNumber : '__________________';
  const adminSigDate = adminSignature ? formatDate(new Date(adminSignature.timestamp)) : '__________';

  const ownerSigName = ownerSignature ? ownerSignature.signerName : '___________________________';
  const ownerSigId = ownerSignature ? ownerSignature.signerIdNumber : '__________________';
  const ownerSigDate = ownerSignature ? formatDate(new Date(ownerSignature.timestamp)) : '__________';

  const cityName = (requirement.city || '').split(',')[0].trim() || 'la ciudad indicada';

  return `
CONTRATO DE SERVICIO DE ALQUILER TURÍSTICO DE INMUEBLE
(Alquiler turístico de inmueble amoblado para alojamiento temporal, a tarifa fija)

Referencia: Requerimiento ${requirement.id} / Oferta ${response.id}
Ciudad y fecha de elaboración: ${cityName}, ${today}

Entre los suscritos, a saber:

EL ARRENDATARIO:
${ARRENDATARIO_NAME}, mayor de edad, identificado con ${ARRENDATARIO_ID}, persona natural bajo
régimen simplificado, quien actúa en nombre propio bajo el nombre comercial ${ARRENDATARIO_BRAND},
en calidad de arrendatario e intermediario de alojamiento para sus propios clientes, en adelante
"EL ARRENDATARIO".
Contacto operativo: ${adminName || requirement.adminContact.name}
Correo: ${requirement.adminContact.email}
Teléfono: ${requirement.adminContact.phone}

EL PROPIETARIO:
${response.ownerContact.name}, mayor de edad, identificado(a) con el documento que se indica en
la firma de este contrato, quien declara ser propietario(a) o tenedor(a) legítimo(a) con facultad
de disposición del inmueble descrito a continuación, en adelante "EL PROPIETARIO".
Correo: ${response.ownerContact.email}
Teléfono: ${response.ownerContact.phone}

Conjuntamente "LAS PARTES", hemos convenido celebrar el presente Contrato de Servicio de Alquiler
Turístico de Inmueble a tarifa fija, que se regirá por las cláusulas que siguen y, en lo no
previsto, por la Ley 300 de 1996 (Ley General de Turismo), modificada por la Ley 1558 de 2012, el
Decreto 1074 de 2015 (Decreto Único Reglamentario del Sector Comercio, Industria y Turismo), y
subsidiariamente por los artículos 1602, 1618 y siguientes del Código Civil colombiano.

DETALLES DEL INMUEBLE Y DE LA RESERVA:
Nombre de la propiedad: ${response.propertyName}
Torre / Apartamento: ${response.torreApartamento || 'No especificado'}
Ciudad / Sector: ${requirement.city}
Tipo de apartamento: ${response.apartmentType}
Número de huéspedes: ${requirement.guestCount}
Fecha de entrada (check-in): ${checkInDate}
Fecha de salida (check-out): ${checkOutDate}
Duración: ${nightCount} noche(s)
Tarifa fija por noche: ${formatCOP(nightlyRate)}
Aseo de salida (check-out): ${formatCOP(cleaningFee)}

CLÁUSULAS:

PRIMERA. OBJETO
EL PROPIETARIO entrega a EL ARRENDATARIO, a título de servicio de alquiler turístico, el uso y
goce del inmueble amoblado y dotado descrito arriba (en adelante "EL INMUEBLE"), por el período y
a la tarifa fija aquí pactados, para que EL ARRENDATARIO lo destine al alojamiento temporal de los
huéspedes que él mismo designe en el marco de su actividad de alojamiento y hospedaje no
permanente.
LAS PARTES declaran expresamente que el presente es un contrato de prestación de servicios
turísticos, en la modalidad de servicio de alquiler turístico de inmueble amoblado para
alojamiento temporal, regido por la Ley 300 de 1996 (Ley General de Turismo), modificada por la
Ley 1558 de 2012, y por el Decreto 1074 de 2015 (Decreto Único Reglamentario del Sector Comercio,
Industria y Turismo). LAS PARTES reconocen que quien opera la actividad turística y contrata
directamente con los huéspedes finales es EL ARRENDATARIO, por lo que ostenta la calidad de
prestador de servicios turísticos y declara que cuenta, o contará antes del check-in de cada
reserva, con Registro Nacional de Turismo (RNT) vigente, siendo el único responsable del
cumplimiento de las obligaciones derivadas de dicha normativa. EL PROPIETARIO declara y garantiza
que el destino turístico de EL INMUEBLE no contraviene el reglamento de propiedad horizontal del
edificio (Ley 675 de 2001) ni restricción alguna de uso del suelo o del POT aplicable. Por
tratarse de un servicio de alojamiento turístico y no de arrendamiento de vivienda urbana
permanente, no le son aplicables las disposiciones de la Ley 820 de 2003.

SEGUNDA. DURACIÓN Y USO
2.1. El servicio tiene una duración fija de ${nightCount} noche(s), desde las 15:00 horas del
${checkInDate} hasta las 11:00 horas del ${checkOutDate}, salvo que LAS PARTES acuerden por
escrito (incluido correo electrónico o mensaje en la plataforma) horarios distintos.
2.2. EL INMUEBLE se destinará exclusivamente a alojamiento temporal de un máximo de
${requirement.guestCount} huésped(es), quedando prohibido cualquier uso distinto, la celebración
de eventos o fiestas y el ingreso de personas no registradas.
2.3. Vencido el plazo, EL ARRENDATARIO restituirá EL INMUEBLE en el estado en que lo recibió,
salvo el deterioro normal por el uso. No opera prórroga automática ni tácita reconducción; toda
extensión requerirá acuerdo escrito y una nueva oferta aceptada en la plataforma.

TERCERA. VALOR Y FORMA DE PAGO
3.1. El valor total del presente contrato es de ${formatCOP(contractTotal)}, discriminado así:
   - Alojamiento: ${nightCount} noche(s) x ${formatCOP(nightlyRate)} = ${formatCOP(lodgingTotal)}
   - Aseo de salida (check-out): ${formatCOP(cleaningFee)}
3.2. Sobre el valor del alojamiento (no sobre el aseo de salida) se aplica la comisión de
intermediación aceptada por EL PROPIETARIO en su oferta, equivalente al ${commissionPercent}%,
es decir ${formatCOP(commissionAmount)}, que EL ARRENDATARIO retendrá de los pagos. El valor
neto a favor de EL PROPIETARIO es de ${formatCOP(ownerNetTotal)}.
3.3. EL ARRENDATARIO pagará a EL PROPIETARIO el valor neto en tres (3) cuotas, mediante
transferencia electrónica a la cuenta que EL PROPIETARIO indique por escrito:
   a) Diez por ciento (10%) — ${formatCOP(pay10)} — a la firma del presente contrato por
      ambas partes.
   b) Cuarenta por ciento (40%) — ${formatCOP(pay40)} — ${secondDueText}.
   c) Cincuenta por ciento (50%) — ${formatCOP(pay50)} — ${thirdDueText}.
3.4. La tarifa por noche es fija e incluye el uso de EL INMUEBLE con su dotación, los servicios
públicos domiciliarios (agua, energía, gas si aplica), internet, la administración del conjunto
o edificio y todo otro costo asociado a la tenencia de EL INMUEBLE. EL PROPIETARIO no podrá
cobrar sumas adicionales a las aquí pactadas, salvo lo previsto en la cláusula CUARTA.
3.5. El retardo de EL ARRENDATARIO en el pago de cualquiera de las cuotas causará intereses
moratorios a la tasa máxima legal permitida certificada por la Superintendencia Financiera de
Colombia (artículo 884 del Código de Comercio), sin necesidad de requerimiento previo. EL
PROPIETARIO no podrá negar el ingreso de los huéspedes mientras EL ARRENDATARIO se encuentre
al día en las cuotas exigibles a la fecha del check-in.
3.6. En atención al régimen tributario de EL ARRENDATARIO (persona natural, régimen
simplificado), cada parte asumirá los impuestos que la ley le imponga por razón de su propia
actividad. EL PROPIETARIO expedirá el documento soporte o factura que corresponda conforme a su
régimen.

CUARTA. ASEO ADICIONAL DURANTE LA ESTADÍA (DE APLICAR)
4.1. Cuando EL ARRENDATARIO o sus huéspedes soliciten servicios de aseo adicionales durante la
estadía, distintos del aseo de salida ya incluido en la cláusula TERCERA, dichos servicios se
prestarán únicamente previa solicitud escrita de EL ARRENDATARIO (correo electrónico o mensaje
en la plataforma) y a la tarifa por servicio que LAS PARTES acuerden por el mismo medio antes
de su prestación.
4.2. Cada aseo adicional se pagará a EL PROPIETARIO el día hábil siguiente a su prestación,
contra confirmación de EL ARRENDATARIO de que el servicio fue efectivamente realizado.
4.3. Sobre el valor de los aseos adicionales no se aplica la comisión de intermediación.
4.4. Si no se solicita ningún aseo adicional, esta cláusula no genera obligación alguna.

QUINTA. OBLIGACIONES DE EL PROPIETARIO
Además de las obligaciones legales del arrendador (artículos 1982 y siguientes del Código
Civil), EL PROPIETARIO se obliga a:
5.1. Entregar EL INMUEBLE en la fecha y hora de check-in, limpio, en buen estado de
funcionamiento, con la dotación, mobiliario, lencería y electrodomésticos descritos en la
oferta y en el material fotográfico compartido en la plataforma.
5.2. Garantizar el uso pacífico de EL INMUEBLE durante todo el período, sin interrupciones,
visitas no coordinadas ni disposición de EL INMUEBLE a terceros durante las fechas contratadas.
5.3. Asumir el costo y la ejecución del aseo de salida (check-out) por el valor indicado en la
cláusula TERCERA.
5.4. Cuando el conjunto o edificio lo exija, gestionar y entregar oportunamente las manillas,
tarjetas, códigos, registro ante portería o cualquier otro elemento o trámite de acceso
necesario para el ingreso de los huéspedes, sin costo adicional para EL ARRENDATARIO.
5.5. Cuando EL ARRENDATARIO lo haya coordinado con antelación, recibir y disponer en EL INMUEBLE
los kits de bienvenida u otros elementos que EL ARRENDATARIO envíe para sus huéspedes, sin
costo adicional.
5.6. Atender y resolver, en un plazo razonable y a su costo, cualquier falla en servicios
públicos, internet, electrodomésticos, cerraduras o instalaciones que no sea imputable a los
huéspedes, y mantener un canal de contacto disponible durante la estadía.
5.7. Declarar que EL INMUEBLE cumple con la reglamentación del conjunto o edificio para el uso
aquí pactado y que no existe prohibición del reglamento de propiedad horizontal que impida el
alojamiento temporal de huéspedes, asumiendo íntegramente las sanciones o restricciones que la
copropiedad llegue a imponer por este concepto.
5.8. No contactar directamente a los huéspedes ni a los clientes de EL ARRENDATARIO con fines
comerciales, ni ofrecerles alojamiento por fuera de la plataforma, durante la vigencia de este
contrato y en los términos del Acuerdo de Confidencialidad referido en la cláusula NOVENA.

SEXTA. OBLIGACIONES DE EL ARRENDATARIO
EL ARRENDATARIO se obliga a:
6.1. Pagar el valor del contrato en la forma y plazos previstos en la cláusula TERCERA.
6.2. Informar a EL PROPIETARIO, con antelación razonable al check-in, el número y nombres de
los huéspedes que ocuparán EL INMUEBLE, dentro del máximo permitido.
6.3. Transmitir a sus huéspedes las reglas de uso de EL INMUEBLE y del conjunto o edificio que
EL PROPIETARIO le haya comunicado por escrito.
6.4. Reportar a EL PROPIETARIO, por escrito y dentro de los dos (2) días hábiles siguientes a
que tenga conocimiento, cualquier daño a EL INMUEBLE o a su dotación ocasionado por los
huéspedes, y coordinar con su propio cliente la atención de dicho reporte.
6.5. Restituir EL INMUEBLE a la terminación del contrato.
PARÁGRAFO PRIMERO — LIMITACIÓN DE RESPONSABILIDAD POR DAÑOS DE HUÉSPEDES. LAS PARTES acuerdan
expresamente que EL ARRENDATARIO actúa como intermediario de alojamiento y que su obligación
frente a daños causados por los huéspedes se limita exclusivamente al deber de reporte y
coordinación descrito en el numeral 6.4. EL ARRENDATARIO no asume responsabilidad económica,
directa ni solidaria, por daños, pérdidas o deterioros causados por los huéspedes a EL INMUEBLE,
a su dotación o a las zonas comunes de la copropiedad, más allá del deterioro normal por el uso.
La reclamación económica por tales daños corresponde a la relación entre EL ARRENDATARIO y su
propio cliente, ajena a este contrato, y EL PROPIETARIO podrá dirigirse directamente contra el
huésped responsable con el apoyo documental que EL ARRENDATARIO le suministre.
PARÁGRAFO SEGUNDO. EL ARRENDATARIO tampoco responde por hurto o pérdida de pertenencias de los
huéspedes, ni por conductas de los huéspedes frente a la copropiedad o terceros.

SÉPTIMA. REDUCCIÓN DE NOCHES
7.1. Si EL ARRENDATARIO, por decisión propia o de su cliente, reduce el número de noches
contratadas, notificará por escrito a EL PROPIETARIO y reconocerá a su favor, sobre el valor de
las noches suprimidas (tarifa por noche x noches suprimidas, sin incluir aseo de salida ni
comisión), el porcentaje que corresponda según la antelación con que se reciba la notificación
respecto de la fecha de check-in:
   - Más de treinta (30) días calendario antes del check-in: cero por ciento (0%).
   - Entre quince (15) y treinta (30) días calendario antes del check-in: veinticinco por
     ciento (25%).
   - Entre siete (7) y catorce (14) días calendario antes del check-in: cincuenta por ciento
     (50%).
   - Menos de siete (7) días calendario antes del check-in, o durante la estadía: cien por
     ciento (100%).
7.2. Las noches efectivamente utilizadas se pagan en su totalidad. Los pagos ya realizados se
imputarán primero a las noches vigentes y luego al porcentaje reconocido; si resulta un
excedente a favor de EL ARRENDATARIO, EL PROPIETARIO lo reembolsará dentro de los cinco (5)
días hábiles siguientes a la notificación.
7.3. Si es EL PROPIETARIO quien, por cualquier causa distinta de fuerza mayor o caso fortuito
debidamente acreditados, deja de poner EL INMUEBLE a disposición durante una o más noches
contratadas, deberá: (i) reembolsar a EL ARRENDATARIO, dentro de los tres (3) días hábiles
siguientes, la totalidad de lo pagado por las noches no prestadas; y (ii) pagar a EL
ARRENDATARIO, a título de cláusula penal, el mismo porcentaje de la escala del numeral 7.1
aplicado al valor de las noches afectadas, según la antelación con que EL PROPIETARIO haya
notificado la no disponibilidad.

OCTAVA. CANCELACIÓN TOTAL
8.1. Cancelación por EL ARRENDATARIO. Si EL ARRENDATARIO, por decisión propia o de su cliente,
cancela totalmente el contrato antes del check-in, reconocerá a EL PROPIETARIO, a título de
indemnización única y total, el porcentaje del valor total del alojamiento (${formatCOP(lodgingTotal)},
sin incluir aseo de salida) que corresponda según la antelación de la notificación escrita:
   - Más de treinta (30) días calendario antes del check-in: cero por ciento (0%).
   - Entre quince (15) y treinta (30) días calendario antes del check-in: veinticinco por
     ciento (25%).
   - Entre siete (7) y catorce (14) días calendario antes del check-in: cincuenta por ciento
     (50%).
   - Menos de siete (7) días calendario antes del check-in: cien por ciento (100%).
   Los pagos ya realizados se imputarán a dicha suma y el excedente, si lo hubiere, será
   reembolsado por EL PROPIETARIO dentro de los cinco (5) días hábiles siguientes.
8.2. Cancelación por EL PROPIETARIO. Si EL PROPIETARIO cancela total o parcialmente el contrato,
o por cualquier causa no imputable a EL ARRENDATARIO deja de entregar EL INMUEBLE en la fecha
pactada, deberá: (i) reembolsar a EL ARRENDATARIO, dentro de los tres (3) días hábiles
siguientes, la totalidad de las sumas recibidas; y (ii) pagar a EL ARRENDATARIO, a título de
cláusula penal (artículos 1592 a 1601 del Código Civil), el mismo porcentaje de la escala del
numeral 8.1 aplicado al valor total del alojamiento, según la antelación con que haya
notificado la cancelación. La cláusula penal se estima anticipadamente como resarcimiento de
los perjuicios sufridos por EL ARRENDATARIO, incluido el mayor costo de reubicar a sus
huéspedes, y podrá exigirse sin necesidad de probar perjuicio.
8.3. Límite de la cláusula penal. En ningún caso la pena exigible a cualquiera de LAS PARTES
excederá el valor de la obligación principal afectada, respetando así el límite del artículo
1601 del Código Civil.
8.4. Mora. Las sumas que EL PROPIETARIO deba reembolsar o pagar a título de pena, y las sumas
que EL ARRENDATARIO deba reconocer bajo esta cláusula, causarán intereses moratorios a la tasa
máxima legal permitida certificada por la Superintendencia Financiera de Colombia desde la fecha
en que sean exigibles y hasta su pago total, sin perjuicio de la pena.
8.5. Fuerza mayor. No habrá lugar a pena cuando el incumplimiento obedezca a fuerza mayor o
caso fortuito debidamente acreditados (artículo 64 del Código Civil); en tal caso solo
procederá el reembolso de lo pagado por las noches no prestadas.
8.6. Toda notificación de reducción o cancelación se hará por escrito a través de la plataforma
o a los correos electrónicos indicados en este contrato, y se entenderá recibida en la fecha de
su envío.

NOVENA. CONFIDENCIALIDAD
El presente contrato se celebra en el marco del Acuerdo de Confidencialidad e Intermediación
suscrito por LAS PARTES a través de la plataforma para esta misma reserva (en adelante "el NDA"),
el cual forma parte integral de este contrato como documento complementario y cuyas
obligaciones conservan plena vigencia. En particular, la información de contacto de los
huéspedes, del cliente de EL ARRENDATARIO, los precios aquí pactados y los términos de la
oferta son información confidencial que no podrá divulgarse ni utilizarse para fines distintos
de la ejecución de este contrato. En caso de contradicción entre el NDA y este contrato en
materia económica, prevalece este contrato; en materia de confidencialidad, prevalece el NDA.

DÉCIMA. PROTECCIÓN DE DATOS PERSONALES
10.1. LAS PARTES tratarán los datos personales a los que tengan acceso con ocasión de este
contrato conforme a la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas concordantes,
únicamente para la ejecución del presente contrato.
10.2. EL PROPIETARIO reconoce que, para el ingreso de los huéspedes, puede requerirse compartir
con la administración o portería del conjunto o edificio datos de identificación de los
huéspedes (nombres, número de documento, placas de vehículos y datos de contacto). EL
ARRENDATARIO entregará dichos datos únicamente en la medida necesaria y EL PROPIETARIO se obliga
a: (i) transmitirlos solo a la administración o portería para el fin de control de acceso;
(ii) no conservarlos ni reutilizarlos una vez finalizada la estadía; y (iii) informar a EL
ARRENDATARIO de cualquier incidente de seguridad que los afecte.
10.3. EL ARRENDATARIO garantiza que cuenta con la autorización de los titulares para la
transmisión de tales datos con el fin indicado.

DÉCIMA PRIMERA. ACEPTACIÓN Y PERFECCIONAMIENTO
11.1. Este contrato se perfecciona con la firma electrónica de ambas partes a través de la
plataforma de EL ARRENDATARIO. LAS PARTES reconocen que la firma electrónica consistente en la
digitación de su nombre completo y número de documento de identidad, junto con la aceptación
expresa mediante casilla de verificación, con registro de fecha y hora, constituye firma
electrónica válida y vinculante en los términos de los artículos 7 y 11 de la Ley 527 de 1999
y del Decreto 2364 de 2012, y renuncian a alegar su invalidez por el solo hecho de constar en
mensaje de datos.
11.2. Este contrato, junto con el NDA y la oferta aceptada en la plataforma, constituye el
acuerdo íntegro entre LAS PARTES respecto de esta reserva y deja sin efecto cualquier acuerdo
verbal o escrito anterior sobre el mismo objeto. Toda modificación requerirá acuerdo escrito
por el mismo medio.
11.3. Las comunicaciones entre LAS PARTES se harán a los correos electrónicos y teléfonos
indicados en este contrato o a través de la plataforma.
11.4. Cualquier controversia derivada de este contrato se intentará resolver directamente entre
LAS PARTES dentro de los quince (15) días siguientes a la reclamación escrita; agotada esta
etapa, LAS PARTES podrán acudir a conciliación extrajudicial en derecho y, en su defecto, a la
justicia ordinaria competente de ${cityName}, Colombia.
11.5. Este contrato presta mérito ejecutivo para el cobro de las sumas líquidas de dinero que
de él se deriven.

---

Declaro que he leído, entendido y acepto en su integridad las cláusulas del presente Contrato
de Servicio de Alquiler Turístico de Inmueble, así como el Acuerdo de Confidencialidad e
Intermediación que lo complementa.

POR EL ARRENDATARIO (${ARRENDATARIO_BRAND}): ___________________________
Nombre: ${adminSigName}
Documento de identidad: ${adminSigId}
Fecha: ${adminSigDate}

EL PROPIETARIO: ___________________________
Nombre: ${ownerSigName}
Documento de identidad: ${ownerSigId}
Fecha: ${ownerSigDate}
`.trim();
}

export function formatContractForDisplay(contract: string): string {
  return contract.split('\n').filter((line) => line.trim()).join('\n');
}

/**
 * SHA-256 hash of the exact rendered contract text at signing time, so a
 * later template edit can never silently change what a party already signed.
 */
export async function hashContractText(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
