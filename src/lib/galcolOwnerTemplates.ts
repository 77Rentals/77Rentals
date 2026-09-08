import type { OwnerUnitType, OwnerSigningFormData } from '@/data/ownerSigningLink';

// Ported verbatim (content-wise) from the finalized Contrato_Arriendo_Propietarios
// Tipo B / Tipo D PDFs and NDA_Propietarios_PLANTILLA PDF for the Galcol booking
// (13 dic 2026 - 17 ene 2027, 35 noches). Only the owner-specific fields are
// parameterized; the legal terms are fixed and must not drift from the signed
// contract's mirror clauses.

interface UnitConfig {
  label: string; // "Apartamento Tipo D" / "Suite Tipo B"
  rate: number; // COP per night
  quoteNo: string;
}

const UNIT_CONFIG: Record<OwnerUnitType, UnitConfig> = {
  D: { label: 'Apartamento Tipo D', rate: 500_000, quoteNo: '77Rentals-CAP-2026-D' },
  B: { label: 'Suite Tipo B', rate: 200_000, quoteNo: '77Rentals-CAP-2026-B' },
};

const NIGHTS = 35;

function formatCOP(value: number): string {
  return `$${Math.round(value).toLocaleString('es-CO')}`;
}

export function getUnitConfig(unitType: OwnerUnitType): UnitConfig {
  return UNIT_CONFIG[unitType];
}

/** Reference per-unit total for the given unit type, used before the owner fills in unit_count. */
export function getUnitTotal(unitType: OwnerUnitType): number {
  return UNIT_CONFIG[unitType].rate * NIGHTS;
}

export function generateGalcolContractText(
  unitType: OwnerUnitType,
  data: OwnerSigningFormData,
  signedAt?: Date
): string {
  const cfg = UNIT_CONFIG[unitType];
  const unitCount = data.unitCount || 1;
  const totalValue = cfg.rate * NIGHTS * unitCount;
  const pay10 = totalValue * 0.1;
  const pay40 = totalValue * 0.4;
  const pay50 = totalValue * 0.5;
  const today = (signedAt ?? new Date()).toLocaleDateString('es-CO');

  return `
CONTRATO DE SERVICIO DE ALQUILER TURÍSTICO DE INMUEBLE — ALOJAMIENTO TEMPORAL
${cfg.quoteNo} · ${cfg.label} · Pozos Colorados, Santa Marta

Entre los suscritos, a saber, de una parte ROBERTO CARLOS RUIZ GÓMEZ, identificado con cédula de
ciudadanía No. 79.719.972, con domicilio en Cartagena, persona natural (régimen simplificado),
dueño del establecimiento de comercio 77RENTALS, quien en adelante se denominará EL ARRENDATARIO;
y de otra parte ${data.ownerName}, identificado(a) con cédula de ciudadanía No. ${data.ownerIdNumber},
con datos de contacto ${data.ownerContactEmail} y ${data.ownerContactPhone}, propietario(a) de la
unidad descrita en la Cláusula Segunda, quien en adelante se denominará EL PROPIETARIO; hemos
convenido celebrar el presente contrato de servicio de alquiler turístico de inmueble para
alojamiento temporal, el cual se regirá por las siguientes cláusulas:

CLÁUSULA PRIMERA — NATURALEZA DEL CONTRATO
El presente es un contrato de prestación de servicios turísticos, en la modalidad de servicio de
alquiler turístico de inmueble amoblado para alojamiento temporal, mediante el cual EL PROPIETARIO
pone a disposición de EL ARRENDATARIO, de forma exclusiva, la unidad descrita en la Cláusula
Segunda durante el período pactado en la Cláusula Tercera, para que EL ARRENDATARIO la explote en
desarrollo de su actividad de alojamiento y hospedaje no permanente a favor de terceros huéspedes,
regida por la Ley 300 de 1996 (Ley General de Turismo), modificada por la Ley 1558 de 2012, y por
el Decreto 1074 de 2015 (Decreto Único Reglamentario del Sector Comercio, Industria y Turismo).
Las partes reconocen que quien opera la actividad turística y contrata directamente con los
huéspedes finales es EL ARRENDATARIO, por lo que ostenta la calidad de prestador de servicios
turísticos y declara que cuenta, o contará antes del check-in, con Registro Nacional de Turismo
(RNT) vigente, siendo el único responsable del cumplimiento de las obligaciones derivadas de dicha
normativa. EL PROPIETARIO declara y garantiza que el destino turístico de la unidad no contraviene
el reglamento de propiedad horizontal del edificio (Ley 675 de 2001) ni restricción alguna de uso
del suelo o del POT aplicable al inmueble. Por tratarse de un servicio de alojamiento turístico y
no de arrendamiento de vivienda urbana permanente, no le son aplicables las disposiciones de la
Ley 820 de 2003. Las partes reconocen y aceptan expresamente esta calificación jurídica como base
de la relación contractual.

CLÁUSULA SEGUNDA — OBJETO
EL PROPIETARIO pone a disposición de EL ARRENDATARIO, en calidad de uso exclusivo, la(s)
siguiente(s) unidad(es):
   Tipo de unidad: ${cfg.label}
   Edificio / Conjunto: ${data.buildingName}
   Apartamento / Torre: ${data.apartmentNumber}
   Número de unidades: ${unitCount}
EL PROPIETARIO declara que la unidad se encuentra en buen estado de funcionamiento, limpia,
dotada y libre de reservas o compromisos de terceros durante todo el período pactado en la
Cláusula Tercera.

CLÁUSULA TERCERA — DURACIÓN Y USO EXCLUSIVO
   Check-in: Domingo, 13 de diciembre de 2026 — 3:00 p. m.
   Check-out: Domingo, 17 de enero de 2027 — 12:00 m.
   Duración total: 35 noches
Durante este período, la unidad quedará reservada de manera exclusiva para EL ARRENDATARIO, quien
la destinará al alojamiento de un equipo de personal de seguridad privada (escoltas) al servicio
de un cliente corporativo. EL PROPIETARIO declara conocer y aceptar esta destinación específica,
sin que ello implique revelar la identidad del cliente corporativo ni de los integrantes del
equipo hospedado, información que se mantiene bajo reserva conforme al Acuerdo de Confidencialidad
(NDA) anexo. EL PROPIETARIO no podrá disponer de la unidad, ofrecerla a terceros ni realizar
reservas que se traslapen con las fechas aquí pactadas.

CLÁUSULA CUARTA — VALOR Y FORMA DE PAGO
El valor del servicio se calcula sobre la tarifa por noche pactada para esta unidad, multiplicada
por el número de unidades y las 35 noches del período pactado:
   Tipo de unidad: ${cfg.label} — Tarifa/noche: ${formatCOP(cfg.rate)} — Noches: 35 — Valor total
   por unidad: ${formatCOP(cfg.rate * NIGHTS)}
Para el presente contrato, EL PROPIETARIO tiene ${unitCount} unidad(es) ${cfg.label}, por lo que
el valor total del contrato es de ${formatCOP(totalValue)} COP (${unitCount} unidad(es) × 35
noches × ${formatCOP(cfg.rate)}).
El valor se pagará en pesos colombianos (COP), en tres (3) cuotas equivalentes al 10%, 40% y 50%
del valor total, en las siguientes fechas:
   10% — 9 de septiembre de 2026 — ${formatCOP(pay10)}
   40% — 25 de noviembre de 2026 — ${formatCOP(pay40)}
   50% restante — 16 de diciembre de 2026 — ${formatCOP(pay50)}
Los pagos se realizarán a la cuenta bancaria que EL PROPIETARIO indique por escrito antes de la
fecha del primer pago.
Las fechas anteriores corresponden a la fecha en que EL ARRENDATARIO efectúa el giro a EL
PROPIETARIO, y son posteriores a las fechas de pago de su cliente. Esto obedece a los tiempos
propios del proceso bancario: los fondos pagados por el cliente de EL ARRENDATARIO tardan
aproximadamente un (1) día hábil en quedar disponibles en la cuenta de EL ARRENDATARIO, y el giro
posterior a EL PROPIETARIO requiere un tiempo adicional de procesamiento bancario. En particular,
el pago del 50% restante lo recibe EL ARRENDATARIO el mismo día de check-in (13 de diciembre de
2026), por lo que el giro correspondiente a EL PROPIETARIO se realizará el día hábil siguiente a
la disponibilidad efectiva de dichos fondos.
Los servicios de aseo, kit de bienvenida y demás costos operativos asociados a la estadía del
grupo corporativo corren por cuenta de EL ARRENDATARIO y no generan costo adicional para EL
PROPIETARIO, salvo lo indicado a continuación. El valor pactado en esta cláusula incluye el aseo
de check-out, las manillas del edificio para los huéspedes y el primer kit de bienvenida (de los
dos kits contemplados durante la estadía), los cuales son responsabilidad de EL PROPIETARIO y no
generan cobro adicional a EL ARRENDATARIO. El segundo kit de bienvenida (de cortesía, entregado a
los 15 días del check-in) corre por cuenta de EL ARRENDATARIO.
Aseo adicional durante la estadía. EL ARRENDATARIO podrá programar, de mutuo acuerdo con EL
PROPIETARIO, aseos adicionales durante la estadía, estimados en uno (1) a dos (2) aseos por
semana por unidad. Cada aseo adicional será pagado por EL ARRENDATARIO a razón de $70.000 COP por
aseo, valor adicional al servicio pactado en esta cláusula, y se pagará el día hábil siguiente a
la realización de cada aseo.

CLÁUSULA QUINTA — OBLIGACIONES DE EL PROPIETARIO
EL PROPIETARIO se obliga a: (i) entregar la unidad limpia, funcional y completamente dotada en la
fecha de check-in, conforme al detalle de dotación descrito a continuación; (ii) garantizar que la
unidad esté libre de reservas o compromisos de terceros durante todo el período pactado; (iii)
permitir el acceso de EL ARRENDATARIO y su personal de aseo/mantenimiento durante la vigencia del
contrato para la correcta prestación del servicio; (iv) informar con la mayor anticipación
posible cualquier situación que pueda afectar la disponibilidad de la unidad.
Dotación mínima para el check-in. La unidad deberá estar provista, como mínimo, de lo siguiente:
   • Una toalla de cuerpo por cada huésped y una toalla adicional de cambio por cada huésped.
   • Tendidos completos para cada cama.
   • Tendidos adicionales disponibles para realizar cambios durante la estadía.
   • Una bolsita pequeña de café.
   • Azúcar.
   • Jabón de manos suficiente para los primeros 5 días.
   • Jabón para lavar la loza suficiente para los primeros 5 días.
   • Una esponja para lavar la loza.
   • 3 litros de agua natural, en botella.
   • Manillas de acceso del edificio para cada huésped.
   • Primer kit de bienvenida (el segundo kit, de cortesía a los 15 días, corre por cuenta de EL
     ARRENDATARIO).
Entrega del apartamento. El equipo operativo de EL ARRENDATARIO realizará la entrega de la
unidad, acompañado por la persona encargada del aseo o por una persona de confianza designada por
EL PROPIETARIO, con el fin de verificar conjuntamente que la unidad se encuentre en las
condiciones aquí acordadas y que todo esté listo para recibir a los huéspedes.

CLÁUSULA SEXTA — OBLIGACIONES DE EL ARRENDATARIO
EL ARRENDATARIO se obliga a: (i) pagar oportunamente el valor pactado en la Cláusula Cuarta; (ii)
hacer uso adecuado de la unidad; (iii) devolver la unidad en el mismo estado en que fue recibida,
salvo el desgaste normal por uso; (iv) reportar de inmediato a EL PROPIETARIO cualquier daño
ocasionado en la unidad durante la estadía, y gestionar ante su cliente corporativo el trámite
correspondiente para la reparación o indemnización de dicho daño. La responsabilidad económica
por los daños causados por los huéspedes durante la estadía corresponde al cliente corporativo de
EL ARRENDATARIO conforme a lo pactado entre ellos, sin que el presente contrato genere
responsabilidad económica directa de EL ARRENDATARIO frente a EL PROPIETARIO por dichos daños.

CLÁUSULA SÉPTIMA — REDUCCIÓN DE NOCHES
Esta cláusula replica, en términos espejo, la escala de reducción de noches pactada entre EL
ARRENDATARIO y su cliente, de forma que EL PROPIETARIO reciba exactamente el mismo porcentaje que
EL ARRENDATARIO reciba de su cliente por dicho concepto. Las siguientes reglas se evalúan de forma
independiente por cada unidad:
a) Reducción de hasta 7 noches por unidad: EL PROPIETARIO recibirá, por cada noche reducida, el
siguiente porcentaje de la tarifa por noche pactada en la Cláusula Cuarta, según la fecha del
aviso escrito:
   Aviso antes del 1 de diciembre de 2026: 0%
   Aviso entre el 1 y el 12 de diciembre de 2026: 15%
   Aviso entre el 13 y el 31 de diciembre de 2026: 30%
   Aviso a partir del 1 de enero de 2027: 40%
b) Reducción entre 8 y 17 noches por unidad: las primeras 7 noches reducidas se rigen por el
literal a); a partir de la octava noche reducida, EL PROPIETARIO recibirá el 90% de la tarifa por
noche pactada, independientemente de la fecha del aviso.
c) Reducción de más de 17 noches por unidad: se entenderá y tratará como cancelación total de esa
unidad, rigiéndose por la Cláusula Octava.
Las noches reducidas bajo cualquiera de los literales anteriores quedarán disponibles para que EL
PROPIETARIO las arriende libremente a terceros, sin restricción de exclusividad.

CLÁUSULA OCTAVA — CANCELACIÓN TOTAL DE LA RESERVA
Esta cláusula replica, en términos espejo y para ambos sentidos, la escala de cancelación total
pactada entre EL ARRENDATARIO y su cliente.
a) Cancelación por decisión del cliente de EL ARRENDATARIO. Si el cliente de EL ARRENDATARIO
cancela en su totalidad la reserva de una o más unidades, EL PROPIETARIO tendrá derecho a
recibir, sobre el valor total pactado en la Cláusula Cuarta para la(s) unidad(es) afectada(s), el
mismo porcentaje que EL ARRENDATARIO reciba de su cliente por dicho concepto, según la fecha del
aviso:
   Aviso escrito recibido hasta el 31 de octubre de 2026: 10%
   Aviso escrito recibido entre el 1 y el 30 de noviembre de 2026: 40%
   Aviso escrito recibido entre el 1 y el 12 de diciembre de 2026: 75%
   Aviso a partir del 13 de diciembre de 2026, no presentación (no-show) o abandono anticipado: 90%
Las sumas ya pagadas por EL ARRENDATARIO a la fecha de la cancelación se imputarán al valor
resultante de la tabla anterior. Cualquier diferencia a favor de una u otra parte se liquidará
dentro de los 5 días hábiles siguientes al aviso de cancelación, y las fechas de la(s) unidad(es)
afectada(s) quedarán liberadas de forma inmediata para EL PROPIETARIO.
b) Cancelación o retiro por decisión de EL PROPIETARIO. Si EL PROPIETARIO retira la unidad de la
disponibilidad pactada, la cancela o la ofrece a terceros durante el período de uso exclusivo sin
causa de fuerza mayor debidamente acreditada, deberá: (i) reintegrar a EL ARRENDATARIO la
totalidad de las sumas ya pagadas, dentro de los 5 días hábiles siguientes; y (ii) pagar a EL
ARRENDATARIO, a título de cláusula penal por estimación anticipada de perjuicios (sin necesidad de
probarlos), el mismo porcentaje del valor total pactado en la Cláusula Cuarta para la unidad
retirada que EL ARRENDATARIO estaría expuesto a perder frente a su cliente en esa misma fecha,
conforme a la tabla anterior (10% / 40% / 75% / 90%, según corresponda a la fecha del retiro).
La pena aquí pactada no exime a EL PROPIETARIO del pago de perjuicios adicionales que EL
ARRENDATARIO acredite y que excedan el valor de la pena. El incumplimiento de EL PROPIETARIO
causará intereses moratorios a la tasa máxima legal permitida en Colombia sobre las sumas a su
cargo, sin necesidad de requerimiento previo para la constitución en mora.

CLÁUSULA NOVENA — CONFIDENCIALIDAD
EL PROPIETARIO se obliga a dar cumplimiento al Acuerdo de Confidencialidad (NDA) suscrito de forma
conjunta con el presente contrato, el cual hace parte integral del mismo y regula el manejo de la
información relativa al huésped, los términos comerciales pactados y el contenido audiovisual de
la unidad durante la estadía.

CLÁUSULA DÉCIMA — TRATAMIENTO DE DATOS PERSONALES
Para efectos de la coordinación de la entrega de la unidad y del registro de huéspedes y
vehículos ante la administración del edificio, las partes podrán intercambiar y tratar datos
personales de los huéspedes (nombres, números de identificación y placas de vehículos)
estrictamente necesarios para dicho fin. Ambas partes se obligan a dar cumplimiento a la Ley 1581
de 2012 y demás normas concordantes sobre protección de datos personales, garantizando que dicha
información se use exclusivamente para las finalidades aquí previstas, se mantenga bajo medidas
razonables de seguridad, y no se comparta con terceros distintos de la administración del
edificio o las autoridades competentes, salvo autorización expresa o mandato legal. EL
ARRENDATARIO será responsable de obtener del huésped las autorizaciones de tratamiento de datos
que resulten necesarias frente a su cliente corporativo.

CLÁUSULA UNDÉCIMA — ACEPTACIÓN Y PERFECCIONAMIENTO
El presente contrato se perfecciona con la firma de ambas partes y el pago de la primera cuota
(10%) prevista en la Cláusula Cuarta. Las partes declaran haber leído, entendido y aceptado la
totalidad de las cláusulas aquí contenidas, y lo suscriben en dos ejemplares del mismo tenor y
valor el ${today}.

EL ARRENDATARIO — 77Rentals
Nombre: Roberto Carlos Ruiz Gómez
C.C.: 79.719.972
Calidad: Persona natural, titular del nombre comercial 77Rentals

EL PROPIETARIO
Nombre: ${data.ownerName}
C.C.: ${data.ownerIdNumber}
Calidad: Propietario(a) de la unidad
Firmado electrónicamente el ${today}.
`.trim();
}

export function generateGalcolNDAText(
  unitType: OwnerUnitType,
  data: OwnerSigningFormData,
  signedAt?: Date
): string {
  const cfg = UNIT_CONFIG[unitType];
  const today = (signedAt ?? new Date()).toLocaleDateString('es-CO');

  return `
ACUERDO DE CONFIDENCIALIDAD (NDA)
77Rentals-NDA-2026 · Plantilla para propietarios · Anexo al Contrato de Servicio de Alquiler
Turístico de Inmueble (${cfg.quoteNo})

Entre los suscritos, a saber, de una parte ROBERTO CARLOS RUIZ GÓMEZ, identificado con cédula de
ciudadanía No. 79.719.972, con domicilio en Cartagena, persona natural (régimen simplificado),
dueño del establecimiento de comercio 77RENTALS, quien en adelante se denominará 77RENTALS; y de
otra parte ${data.ownerName}, identificado(a) con cédula de ciudadanía No. ${data.ownerIdNumber},
propietario(a) de la unidad descrita en el Contrato de Servicio de Alquiler Turístico de Inmueble
${cfg.quoteNo}, quien en adelante se denominará EL PROPIETARIO; hemos convenido celebrar el
presente Acuerdo de Confidencialidad, anexo e integral al contrato de servicio antes referido, el
cual se regirá por las siguientes cláusulas:

CLÁUSULA PRIMERA — OBJETO
El presente Acuerdo tiene por objeto establecer las obligaciones de confidencialidad que EL
PROPIETARIO debe observar en relación con la información a la que tenga acceso con ocasión del
alquiler turístico de su unidad a 77RENTALS para el alojamiento de un grupo corporativo durante el
período comprendido entre el 13 de diciembre de 2026 y el 17 de enero de 2027.

CLÁUSULA SEGUNDA — INFORMACIÓN CONFIDENCIAL
Para efectos de este Acuerdo, se considera Información Confidencial, de forma enunciativa y no
taxativa:
a) La identidad del huésped/cliente corporativo, así como cualquier dato relativo a las personas
que integran el grupo hospedado, incluyendo información relacionada con su esquema de seguridad,
movimientos, horarios o rutinas.
b) Los términos comerciales pactados entre 77RENTALS y EL PROPIETARIO, incluyendo tarifas,
condiciones de pago, fechas y cualquier otro término del Contrato de Servicio de Alquiler
Turístico de Inmueble.
c) Cualquier fotografía, video, grabación de audio, imagen o contenido audiovisual del interior
de la unidad, o de los huéspedes, captado por cualquier medio durante el período en que esté
ocupada por el grupo hospedado.

CLÁUSULA TERCERA — OBLIGACIONES DE EL PROPIETARIO
EL PROPIETARIO se obliga a: (i) no revelar, divulgar, publicar ni comentar con terceros la
identidad del huésped ni ninguna información relativa a su esquema de seguridad; (ii) no revelar
los términos comerciales pactados con 77RENTALS a terceros ajenos a la relación contractual;
(iii) abstenerse de tomar, publicar o compartir en redes sociales, plataformas digitales o
cualquier otro medio, fotografías o videos del interior de la unidad mientras esté ocupada por el
grupo hospedado; (iv) no acercarse, contactar ni intentar identificar a los huéspedes durante su
estadía, salvo coordinación previa y expresa con 77RENTALS; (v) instruir a su personal doméstico,
familiares o terceros con acceso a la unidad sobre las obligaciones aquí contenidas.
Prohibición absoluta de grabación dentro de la unidad. Queda terminantemente prohibido para EL
PROPIETARIO instalar, mantener activo o utilizar cualquier dispositivo de grabación de audio,
video o imagen dentro de la unidad durante el período en que esté ocupada por el grupo hospedado,
incluyendo cámaras de seguridad interiores, asistentes de voz, cámaras ocultas o cualquier otro
medio de captación. EL PROPIETARIO deberá desactivar o retirar cualquier dispositivo de este tipo
que ya se encuentre instalado dentro de la unidad antes del check-in, y permitir su verificación
por parte de EL ARRENDATARIO. El incumplimiento de esta prohibición se considerará una violación
grave del presente Acuerdo para todos los efectos de la Cláusula Sexta.

CLÁUSULA CUARTA — EXCEPCIONES
Las obligaciones de confidencialidad no aplicarán respecto de información que: (i) sea de dominio
público sin que medie incumplimiento de este Acuerdo; (ii) deba revelarse por mandato de
autoridad competente, caso en el cual EL PROPIETARIO deberá informar a 77RENTALS de forma previa,
en la medida en que la ley lo permita; o (iii) sea necesaria para reportar una emergencia de
seguridad, salud o similar a las autoridades competentes.

CLÁUSULA QUINTA — VIGENCIA
Las obligaciones de confidencialidad aquí pactadas estarán vigentes desde la firma del presente
Acuerdo y se mantendrán indefinidamente respecto de la identidad y datos del huésped y su esquema
de seguridad, y por un término de dos (2) años respecto de los términos comerciales del contrato,
contados a partir de la terminación del período de alquiler.

CLÁUSULA SEXTA — INCUMPLIMIENTO
El incumplimiento de cualquiera de las obligaciones establecidas en este Acuerdo facultará a
77RENTALS para (i) exigir el retiro inmediato de cualquier contenido publicado en contravención a
la Cláusula Tercera; (ii) reclamar la indemnización de los perjuicios que dicho incumplimiento le
cause a 77RENTALS o a su cliente corporativo; y (iii) dar por terminado el Contrato de Servicio de
Alquiler Turístico de Inmueble vigente entre las partes, sin perjuicio de las demás acciones
legales a que haya lugar.

CLÁUSULA SÉPTIMA — ACEPTACIÓN Y PERFECCIONAMIENTO
El presente Acuerdo se perfecciona con la firma de ambas partes y hace parte integral del
Contrato de Servicio de Alquiler Turístico de Inmueble ${cfg.quoteNo}. Las partes declaran haber
leído, entendido y
aceptado la totalidad de las cláusulas aquí contenidas, y lo suscriben en dos ejemplares del
mismo tenor y valor el ${today}.

77RENTALS
Nombre: Roberto Carlos Ruiz Gómez
C.C.: 79.719.972

EL PROPIETARIO
Nombre: ${data.ownerName}
C.C.: ${data.ownerIdNumber}
Firmado electrónicamente el ${today}.
`.trim();
}

export function formatForDisplay(text: string): string {
  return text.split('\n').filter((line) => line.trim()).join('\n');
}

export async function hashText(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
