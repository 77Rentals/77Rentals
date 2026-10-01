// Posts for the AI consulting blog (/ai/blog/). Written by the
// ai-consulting-writer agent (.claude/agents/ai-consulting-writer.md) around
// real problems Colombian SMBs have with AI. Same block model as the travel
// blog; the `cta` block renders the consulting WhatsApp box instead.
// Newest post first.
import type { BlogPost } from './blog';

export const aiBlogPosts: BlogPost[] = [
  {
    slug: 'extraer-datos-facturas-ia',
    date: '2026-10-01',
    readingMinutes: 7,
    cover: '/images/bogota.jpg',
    es: {
      title: 'Facturas y remisiones a Excel con IA: guía para pymes',
      metaDescription:
        'Cómo dejar de digitar facturas, remisiones y PDFs a mano: qué lee bien la IA, por qué el XML de la DIAN va primero y cómo empezar con tu equipo esta semana.',
      excerpt:
        'Tu equipo abre cada factura y cada remisión y copia los datos a Excel a mano. Qué parte resuelve el XML de la DIAN, qué parte la IA y qué debe revisar siempre una persona.',
      tags: ['IA para pymes', 'Automatización de documentos', 'Negocio'],
      body: [
        { type: 'h2', text: '¿Tu equipo pasa facturas y remisiones a Excel a mano?' },
        { type: 'p', text: 'Es martes y se acerca el cierre de mes. La auxiliar contable tiene el correo lleno de archivos comprimidos de proveedores, una carpeta con fotos de remisiones que el de bodega mandó por WhatsApp y un Excel abierto. Abre cada PDF y copia el NIT, el número de factura, la fecha, el subtotal, el IVA y el total. Después busca la remisión para confirmar que llegó lo que le están cobrando.' },
        { type: 'p', text: 'Son unos minutos por documento, a veces más. Un cero de más o un NIT con un dígito cambiado no se nota hasta el cierre, cuando la cuenta no cuadra y toca revisar todo otra vez.' },
        { type: 'p', text: 'Si te suena, no es un problema de disciplina. Es un proceso que se armó cuando los documentos llegaban en papel y que nadie volvió a pensar.' },

        { type: 'h2', text: '¿Por qué se sigue digitando si ya existe la factura electrónica?' },
        { type: 'p', text: 'Cuando tu proveedor es facturador electrónico, la factura no es el PDF. Según el anexo técnico de la DIAN adoptado con la Resolución 000165 de 2023, la factura es un archivo XML firmado digitalmente. El PDF es su representación gráfica, y la información que aparece en ese PDF tiene que estar contenida en el XML.' },
        { type: 'p', text: 'Dicho de otra forma: buena parte de los datos que tu equipo digita ya llegan estructurados en el mismo correo. Se pierden por otras razones:' },
        { type: 'ul', items: [
          '**Se trabaja sobre el archivo equivocado.** El correo trae el XML y el PDF, y el equipo usa el PDF porque es el que se puede leer.',
          '**No todo es factura electrónica.** Las remisiones, las cuentas de cobro de personas que no facturan y los soportes de caja menor llegan en papel, foto o PDF escaneado, cada uno con su propio formato.',
          '**Los documentos entran por todos lados:** correo, WhatsApp, el portal del proveedor o la mano del mensajero.',
          '**Nadie escribió las reglas.** Qué dato va en qué columna, cómo se clasifica cada gasto, qué se hace si la remisión no coincide. Cada persona lo resuelve a su manera.',
        ] },
        { type: 'p', text: 'La IA ayuda con el segundo punto. Para el primero no necesitas IA: necesitas leer el XML que ya tienes.' },

        { type: 'h2', text: '¿Qué puede extraer la IA de una factura en PDF o una foto?' },
        { type: 'p', text: 'A octubre de 2026 hay dos tipos de herramienta para leer documentos que no vienen estructurados:' },
        { type: 'ul', items: [
          '**Modelos generales con visión**, como Claude, ChatGPT o Gemini. Leen el PDF o la foto y te devuelven los campos que les pidas. Claude, por ejemplo, procesa cada página de un PDF como texto y como imagen, así que también entiende tablas y documentos escaneados.',
          '**Servicios especializados en documentos**, como el Invoice Parser de Google Document AI o el modelo de facturas de Azure Document Intelligence. Vienen entrenados para facturas y aceptan documentos en español. El de Google, además, devuelve un nivel de confianza por cada campo.',
        ] },
        { type: 'p', text: 'Con cualquiera de los dos, la clave es pedir una **salida estructurada**: tú defines las columnas (NIT, número, fecha, subtotal, IVA, total, número de remisión) y la herramienta llena exactamente esas, siempre en el mismo formato, listas para tu Excel o para importar al software contable.' },
        { type: 'p', text: 'Funciona bien con encabezados, totales y tablas de productos limpias en documentos digitales. Falla más con:' },
        { type: 'ul', items: [
          'Remisiones escritas a mano o con tachones.',
          'Fotos movidas, oscuras o tomadas en ángulo.',
          'Tablas que continúan en la página siguiente.',
          'Números con formatos distintos: un proveedor escribe 1.250.000 y otro 1,250,000.',
          'Sellos o firmas encima de los datos.',
        ] },
        { type: 'tip', title: 'Primero el XML, después la IA', text: 'Si el documento es una factura electrónica, no le pidas a un modelo que lea el PDF. Toma los datos del XML, que es el documento válido y no tiene errores de lectura. Deja la IA para lo que no viene estructurado: remisiones, cuentas de cobro y soportes en papel.' },

        { type: 'h2', text: '¿Cómo empezar a automatizar la entrada de datos esta semana?' },
        { type: 'p', text: 'Los primeros pasos no requieren comprar nada:' },
        { type: 'ul', items: [
          '**Día 1: cuenta los documentos.** Anota cuántos llegan por tipo (factura electrónica, remisión, cuenta de cobro, otros), por qué canal y cuánto tarda cada uno en quedar en el Excel. Si puedes, sigue midiendo toda la semana.',
          '**Día 2: define la plantilla de salida.** Las columnas exactas que necesitas y su formato: fechas en un solo formato, valores sin signos, el NIT con o sin dígito de verificación, pero siempre igual.',
          '**Día 3: separa el camino de las facturas electrónicas.** Pregunta si tu software contable o tu proveedor de facturación ya importa los XML recibidos. El portal "Facturando electrónicamente" de la DIAN también permite descargar listados de los documentos recibidos en un rango de fechas, útil para conciliar.',
          '**Día 4: prueba la IA con 30 documentos reales.** Escoge remisiones y soportes de varios proveedores, incluidos los más feos. Pásalos por la herramienta con tu plantilla y compara el resultado contra lo que digitó tu equipo.',
          '**Día 5: escribe las reglas de validación.** Subtotal más IVA igual al total, NIT que exista en tu lista de proveedores, número de factura que no esté repetido y cantidades de la remisión que coincidan con las de la factura.',
        ] },
        { type: 'p', text: 'Al final de la semana sabes qué tan grande es el problema, qué parte resuelve el XML y qué parte necesita IA. Para conectar las piezas puedes usar herramientas sin código como n8n, Make o Zapier junto con la API de un modelo, o el módulo de recepción de documentos de tu software contable si ya lo trae. La elección depende del volumen, de tus sistemas y de los datos que va a tocar.' },
        { type: 'tip', title: 'Mide por campo, no por documento', text: '"Acertó en 28 de 30 documentos" dice poco. Cuenta los errores por campo: si siempre falla en el número de remisión o en el IVA, sabes exactamente qué ajustar o qué dejar en revisión manual.' },

        { type: 'h2', text: '¿Cómo se cruza esto con los plazos de la factura electrónica?' },
        { type: 'p', text: 'Aquí la automatización deja de ser solo ahorro de tiempo. En las facturas electrónicas a crédito, el comprador registra eventos ante la DIAN: acuse de recibo, recibo del bien o servicio y aceptación. Y según el artículo 773 del Código de Comercio, si no reclamas dentro de los tres días hábiles siguientes a recibir la mercancía o el servicio, la factura queda aceptada tácitamente.' },
        { type: 'p', text: 'Si la comparación entre remisión y factura se hace a fin de mes, ese plazo ya pasó. Un flujo que cruza los dos documentos el mismo día que llegan te avisa a tiempo cuando te cobraron 100 unidades y la remisión dice 90. La IA señala la diferencia; la decisión de reclamar la toma una persona.' },
        { type: 'p', text: 'Algo parecido pasa con las compras a personas que no están obligadas a facturar: ahí eres tú quien genera el documento soporte electrónico, según la Resolución 000167 de 2021 de la DIAN. La IA puede preparar los datos a partir de la cuenta de cobro, pero alguien los revisa antes de transmitir.' },
        { type: 'p', text: 'Esto es información general, no asesoría tributaria ni legal. Antes de cambiar cómo recibes y aceptas facturas, revísalo con tu contador.' },

        { type: 'h2', text: '¿Qué riesgos tiene y qué no debería hacer la IA?' },
        { type: 'ul', items: [
          '**Leer mal un número.** Un modelo puede confundir un 7 con un 1 en una foto borrosa. La salida estructurada garantiza el formato, no que el valor sea correcto. Para eso están las reglas del día 5: lo que no pase la validación va a revisión.',
          '**Decidir por ti.** La IA extrae y propone. No aprueba pagos, no acepta ni rechaza facturas y no define el tratamiento tributario de un gasto.',
          '**Mandar datos a donde no deben.** Las facturas y cuentas de cobro de personas naturales traen nombre, cédula y a veces cuenta bancaria: son datos personales bajo la Ley 1581 de 2012. Usa cuentas empresariales o una API con condiciones claras sobre el uso de tus datos, nunca un chat gratuito.',
          '**Costos que crecen con el volumen.** Estas herramientas cobran por página o por cantidad de contenido procesado, y las tarifas cambian seguido. Calcula con tu volumen real del día 1 y revisa el precio vigente del proveedor.',
          '**Botar el original.** El Excel no reemplaza el soporte. Guarda los XML, los PDF y las fotos de las remisiones.',
        ] },
        { type: 'p', text: 'Durante el primer mes, revisa todo lo que extrae la herramienta. Cuando tengas claro dónde se equivoca, deja la revisión solo para los documentos que no pasan la validación o que salen con baja confianza.' },

        { type: 'h2', text: '¿Vale la pena para tu empresa?' },
        { type: 'p', text: 'Si recibes pocos documentos a la semana, quizá basta con importar los XML y ordenar la carpeta. Si son cientos al mes, de muchos proveedores y con remisiones en papel, la combinación de XML, IA y reglas de validación libera horas y te muestra a tiempo errores que hoy encuentras tarde.' },
        { type: 'p', text: 'Es la misma lógica que usamos en 77Rentals con los contratos: primero datos estructurados y reglas claras, después la automatización. La IA hace la parte repetitiva y una persona revisa lo que importa.' },
        { type: 'cta' },
      ],
    },
    en: {
      title: 'Invoice data extraction with AI for small businesses',
      metaDescription:
        'How to stop typing invoices, delivery notes and PDFs by hand: what AI reads well, why the DIAN XML comes first and how your team can start this week.',
      excerpt:
        'Your team opens every invoice and delivery note and types the data into Excel by hand. What the DIAN XML already solves, what AI can handle and what a person must always check.',
      tags: ['AI for SMBs', 'Document automation', 'Business'],
      body: [
        { type: 'h2', text: 'Is your team typing invoices and delivery notes into Excel by hand?' },
        { type: 'p', text: 'It is Tuesday and month-end close is coming. Your accounting assistant has an inbox full of zipped files from suppliers, a folder of delivery-note (remisión) photos the warehouse sent over WhatsApp, and an open spreadsheet. She opens each PDF and copies the tax ID (NIT), invoice number, date, subtotal, VAT and total. Then she looks for the delivery note to confirm that what arrived matches what was billed.' },
        { type: 'p', text: 'That is a few minutes per document, sometimes more. An extra zero or a NIT with one wrong digit goes unnoticed until the close, when the numbers do not add up and everything has to be checked again.' },
        { type: 'p', text: 'If this sounds familiar, it is not a discipline problem. It is a process designed when documents arrived on paper, and nobody has rethought it since.' },

        { type: 'h2', text: 'Why is data still typed by hand if Colombia already has e-invoicing?' },
        { type: 'p', text: 'When your supplier issues electronic invoices, the invoice is not the PDF. Under the DIAN technical annex adopted by Resolution 000165 of 2023, the invoice is a digitally signed XML file. The PDF is its graphic representation, and the information shown in that PDF must be contained in the XML.' },
        { type: 'p', text: 'In other words, much of the data your team types already arrives structured in the same email. It gets lost for other reasons:' },
        { type: 'ul', items: [
          '**People work from the wrong file.** The email carries both the XML and the PDF, and the team uses the PDF because it is the one they can read.',
          '**Not everything is an e-invoice.** Delivery notes, bills from individuals who are not required to invoice, and petty-cash receipts arrive on paper, as photos or as scanned PDFs, each in its own format.',
          '**Documents come in through every channel:** email, WhatsApp, the supplier\'s portal or the courier\'s hand.',
          '**Nobody wrote down the rules.** Which field goes in which column, how each expense is classified, what to do when the delivery note does not match. Everyone handles it their own way.',
        ] },
        { type: 'p', text: 'AI helps with the second point. For the first one you do not need AI: you need to read the XML you already have.' },

        { type: 'h2', text: 'What can AI extract from a PDF invoice or a photo?' },
        { type: 'p', text: 'As of October 2026 there are two kinds of tools for reading documents that do not arrive structured:' },
        { type: 'ul', items: [
          '**General models with vision**, such as Claude, ChatGPT or Gemini. They read the PDF or photo and return the fields you ask for. Claude, for example, processes each PDF page as both text and image, so it also handles tables and scanned documents.',
          '**Specialized document services**, such as the Invoice Parser in Google Document AI or the invoice model in Azure Document Intelligence. They are trained for invoices and support Spanish documents. Google\'s also returns a confidence score for each field.',
        ] },
        { type: 'p', text: 'With either one, the key is to ask for **structured output**: you define the columns (NIT, number, date, subtotal, VAT, total, delivery-note number) and the tool fills exactly those, always in the same format, ready for your spreadsheet or for import into your accounting software.' },
        { type: 'p', text: 'It works well on headers, totals and clean product tables in digital documents. It struggles more with:' },
        { type: 'ul', items: [
          'Handwritten delivery notes or notes with crossed-out values.',
          'Blurry, dark or angled photos.',
          'Tables that continue onto the next page.',
          'Different number formats: one supplier writes 1.250.000 and another 1,250,000.',
          'Stamps or signatures on top of the data.',
        ] },
        { type: 'tip', title: 'XML first, AI second', text: 'If the document is an electronic invoice, do not ask a model to read the PDF. Take the data from the XML, which is the valid document and has no reading errors. Save AI for what is not structured: delivery notes, bills from individuals and paper receipts.' },

        { type: 'h2', text: 'How can you start automating data entry this week?' },
        { type: 'p', text: 'The first steps do not require buying anything:' },
        { type: 'ul', items: [
          '**Day 1: count the documents.** Log how many arrive by type (e-invoice, delivery note, bill from an individual, other), through which channel, and how long each one takes to land in the spreadsheet. If you can, keep logging for the whole week.',
          '**Day 2: define the output template.** The exact columns you need and their format: dates in a single format, amounts without symbols, the NIT with or without its check digit, but always the same way.',
          '**Day 3: split off the e-invoice path.** Ask whether your accounting software or e-invoicing provider already imports received XML files. DIAN\'s "Facturando electrónicamente" portal also lets you download lists of documents received within a date range, which helps with reconciliation.',
          '**Day 4: test AI on 30 real documents.** Pick delivery notes and receipts from several suppliers, including the messiest ones. Run them through the tool with your template and compare the output with what your team typed.',
          '**Day 5: write the validation rules.** Subtotal plus VAT equals the total, the NIT exists in your supplier list, the invoice number is not a duplicate, and the delivery-note quantities match the invoice.',
        ] },
        { type: 'p', text: 'By the end of the week you know how big the problem is, what the XML solves and what needs AI. To connect the pieces you can use no-code tools such as n8n, Make or Zapier together with a model\'s API, or the document-intake module in your accounting software if it has one. The right choice depends on volume, your systems and which data it will touch.' },
        { type: 'tip', title: 'Measure by field, not by document', text: '"It got 28 out of 30 documents right" tells you little. Count errors per field: if it always misses the delivery-note number or the VAT, you know exactly what to adjust or keep under manual review.' },

        { type: 'h2', text: 'How does this fit with Colombian e-invoicing deadlines?' },
        { type: 'p', text: 'This is where automation stops being only about saving time. For electronic invoices on credit, the buyer registers events with DIAN: acknowledgment of receipt, receipt of the goods or service, and acceptance. Under Article 773 of the Colombian Commercial Code, if you do not dispute the invoice within three business days after receiving the goods or service, it is tacitly accepted.' },
        { type: 'p', text: 'If delivery notes and invoices are compared at month-end, that window has already closed. A flow that matches both documents the day they arrive warns you in time when you were billed for 100 units and the delivery note says 90. AI flags the difference; a person decides whether to dispute it.' },
        { type: 'p', text: 'Something similar applies to purchases from individuals who are not required to invoice: there, you are the one who issues the electronic support document (documento soporte), under DIAN Resolution 000167 of 2021. AI can prepare the data from the individual\'s bill, but someone checks it before it is transmitted.' },
        { type: 'p', text: 'This is general information, not tax or legal advice. Before changing how you receive and accept invoices, review it with your accountant.' },

        { type: 'h2', text: 'What are the risks, and what should AI not do?' },
        { type: 'ul', items: [
          '**Misreading a number.** A model can mistake a 7 for a 1 in a blurry photo. Structured output guarantees the format, not that the value is correct. That is what the day-5 rules are for: anything that fails validation goes to review.',
          '**Deciding for you.** AI extracts and proposes. It does not approve payments, accept or reject invoices, or decide the tax treatment of an expense.',
          '**Sending data where it should not go.** Invoices and bills from individuals include names, ID numbers and sometimes bank accounts: that is personal data under Colombia\'s Law 1581 of 2012. Use business accounts or an API with clear terms on how your data is used, never a free chat.',
          '**Costs that grow with volume.** These tools charge per page or by the amount of content processed, and rates change often. Estimate with your real volume from day 1 and check the provider\'s current pricing.',
          '**Throwing away the original.** The spreadsheet does not replace the source document. Keep the XML files, the PDFs and the delivery-note photos.',
        ] },
        { type: 'p', text: 'During the first month, review everything the tool extracts. Once you know where it gets things wrong, limit review to documents that fail validation or come back with low confidence.' },

        { type: 'h2', text: 'Is it worth it for your company?' },
        { type: 'p', text: 'If you receive only a few documents a week, importing the XML files and organizing the folder may be enough. If you get hundreds a month from many suppliers, with paper delivery notes, combining XML, AI and validation rules frees up hours and shows you in time the errors you now find too late.' },
        { type: 'p', text: 'It is the same logic we use at 77Rentals for contracts: structured data and clear rules first, automation second. AI does the repetitive part and a person reviews what matters.' },
        { type: 'cta' },
      ],
    },
    sources: [
      { title: 'DIAN: Anexo técnico de la factura electrónica de venta v1.9 (Resolución 000165 de 2023)', url: 'https://www.dian.gov.co/impuestos/factura-electronica/Documents/Anexo-Tecnico-Factura-Electronica-de-Venta-vr-1-9.pdf' },
      { title: 'DIAN: Documento soporte con sujetos no obligados a expedir factura', url: 'https://www.dian.gov.co/impuestos/Paginas/Sistema-de-Factura-Electronica/Documento-Soporte-Adquisiciones-No-Obligados.aspx' },
      { title: 'DIAN: Resolución 000167 de 2021 (documento soporte)', url: 'https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000167%20de%2030-12-2021.pdf' },
      { title: 'Código de Comercio, artículo 773: aceptación de la factura', url: 'https://leyes.co/codigo_de_comercio/773.htm' },
      { title: 'Gerencie: aceptación y rechazo de la factura electrónica', url: 'https://www.gerencie.com/aceptacion-y-rechazo-de-la-factura-electronica.html' },
      { title: 'Alegra: cómo descargar listados de documentos en la DIAN', url: 'https://ayuda.alegra.com/col/descargar-listados-en-la-dian' },
      { title: 'Anthropic: PDF support (Claude)', url: 'https://platform.claude.com/docs/en/build-with-claude/pdf-support' },
      { title: 'Anthropic: Structured outputs (Claude)', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
      { title: 'Google Cloud: Document AI processor list (Invoice Parser)', url: 'https://docs.cloud.google.com/document-ai/docs/processors-list' },
      { title: 'Microsoft: Document Intelligence language support for prebuilt models', url: 'https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/language-support/prebuilt?view=doc-intel-4.0.0' },
      { title: 'Función Pública: Ley 1581 de 2012', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981' },
    ],
  },
  {
    slug: 'agente-whatsapp-ia-atencion-cliente',
    date: '2026-09-28',
    readingMinutes: 7,
    cover: '/images/bogota.jpg',
    es: {
      title: 'Atención por WhatsApp con IA: qué automatizar y qué no',
      metaDescription:
        'Qué puede responder un agente de WhatsApp con IA en tu pyme, qué debe quedar en manos de una persona y qué cambia con los nuevos cobros de Meta.',
      excerpt:
        'Tu equipo responde lo mismo por WhatsApp todo el día y los mensajes de la noche se pierden. Qué puede hacer un agente con IA y qué debe seguir en manos de una persona.',
      tags: ['IA para pymes', 'Automatizar WhatsApp', 'Negocio'],
      body: [
        { type: 'h2', text: '¿Tu equipo responde lo mismo por WhatsApp todo el día?' },
        { type: 'p', text: 'Es martes, 10 de la mañana. La persona de ventas está armando una cotización y el celular no para: "¿Tienen disponible?", "¿Cuánto vale el envío a Medellín?", "¿Hasta qué hora atienden?", "¿Me manda la ubicación?". Deja la cotización a medias, pega el mismo mensaje por quinta vez y vuelve a empezar.' },
        { type: 'p', text: 'A las 7 de la noche llegan otros diez mensajes. Nadie los ve hasta el otro día y, para entonces, dos de esos clientes ya le compraron a otro.' },
        { type: 'p', text: 'No es un caso raro. Según un informe de HubSpot sobre Colombia, el 71 % de los equipos comerciales usa WhatsApp para prospectar y contactar clientes, y el 36 % de las áreas de servicio lo cuenta entre sus principales canales de atención. El cliente ya está ahí; lo que falta es una forma ordenada de atenderlo.' },

        { type: 'h2', text: '¿Por qué el WhatsApp de la empresa se vuelve un cuello de botella?' },
        { type: 'p', text: 'Casi nunca es falta de ganas. Es la forma en que se armó el canal:' },
        { type: 'ul', items: [
          '**El número vive en el celular de una persona.** Si esa persona sale a almorzar, se va de vacaciones o renuncia, la atención se detiene.',
          '**Las respuestas no están escritas.** Cada quien contesta a su manera, a veces con precios o condiciones que ya cambiaron.',
          '**Todo llega revuelto.** La pregunta por el horario, el pedido de 5 millones y la queja de un cliente molesto caen en el mismo chat, con la misma prioridad.',
          '**No hay medición.** Nadie sabe cuántos mensajes llegan al día, cuánto tarda la primera respuesta ni cuántos se quedan sin contestar.',
        ] },
        { type: 'p', text: 'Un agente con IA ayuda con el primer y el tercer punto, pero solo si antes resuelves el segundo. Si tus respuestas no están escritas, la IA las va a improvisar.' },

        { type: 'h2', text: '¿Qué puede responder un agente de WhatsApp con IA?' },
        { type: 'p', text: 'Un agente bien configurado funciona en conversaciones que siguen reglas claras y se apoyan en información que ya tienes. Estos son los casos donde suele rendir:' },
        { type: 'ul', items: [
          '**Preguntas frecuentes:** horarios, ubicación, medios de pago, tiempos de entrega, políticas de cambio. Responde desde un documento que tú apruebas, no desde lo que el modelo "cree".',
          '**Disponibilidad y precios de catálogo:** siempre que consulte una fuente real, como tu inventario, una hoja de cálculo o tu sistema de ventas.',
          '**Calificar prospectos:** pregunta qué necesita el cliente, para cuándo, en qué ciudad y con qué presupuesto, y le pasa a tu vendedor un resumen listo para cerrar.',
          '**Agendar citas o visitas:** ofrece los horarios libres de tu calendario y confirma.',
          '**Estado de pedidos:** consulta el número de pedido o de guía y responde con el dato del sistema.',
          '**Fuera de horario:** atiende lo básico de noche y el fin de semana, y deja lo demás organizado para la mañana.',
        ] },
        { type: 'tip', title: 'Si no está en la fuente, no lo dice', text: 'Configura el agente para que responda solo con información de tus documentos y sistemas. Si no encuentra el dato, debe decirlo y pasar la conversación a una persona, nunca inventarse un precio o una fecha.' },

        { type: 'h2', text: '¿Qué no deberías automatizar en la atención por WhatsApp?' },
        { type: 'p', text: 'Esta es la parte que muchos proveedores no cuentan. Hay conversaciones donde una respuesta rápida pero equivocada sale más cara que una respuesta lenta. Esas deben ir a una persona desde el primer mensaje:' },
        { type: 'ul', items: [
          '**Quejas y reclamos.** Un cliente molesto necesita que alguien lo escuche y tenga autoridad para resolver. Una respuesta automática, por amable que sea, suele empeorar las cosas.',
          '**Plata:** reembolsos, descuentos, cambios de precio, acuerdos de pago o excepciones a tu política.',
          '**Temas de salud, legales o financieros** donde la respuesta depende del caso. El agente puede recibir la consulta; la respuesta la da quien sabe.',
          '**Negociaciones y ventas grandes.** El agente califica y organiza; el cierre lo hace tu equipo.',
          '**Cualquier cosa que la IA no pueda verificar** contra tus datos.',
        ] },
        { type: 'p', text: 'Esto no es solo buena práctica. La política de mensajería de WhatsApp Business exige que, si automatizas la atención, el cliente tenga una forma rápida y clara de llegar a una persona: en el mismo chat, por teléfono, por correo o en tu sitio web.' },
        { type: 'p', text: 'Además, desde el 15 de enero de 2026 Meta no permite en la plataforma empresarial de WhatsApp (la API) chatbots de IA de propósito general, es decir, asistentes que conversan de cualquier tema. Los agentes enfocados en tareas del negocio, como atención al cliente, pedidos o citas, siguen permitidos. Para una pyme la conclusión es sencilla: tu agente habla de tu negocio y de nada más.' },
        { type: 'tip', title: 'Dile al cliente con quién habla', text: 'Que el primer mensaje aclare que es un asistente automático y cómo pedir una persona. Es más honesto y reduce la frustración cuando el caso se complica.' },

        { type: 'h2', text: '¿Cómo empezar a automatizar WhatsApp esta semana?' },
        { type: 'p', text: 'No necesitas arrancar con un agente completo. Estos pasos los puedes dar en los próximos cinco días:' },
        { type: 'ul', items: [
          '**Día 1: cuenta las preguntas.** Revisa los chats de las últimas dos semanas y anota las diez preguntas que más se repiten.',
          '**Día 2: escribe las respuestas aprobadas.** Un documento corto con cada respuesta, el precio o la condición vigente y quién la aprobó. Esa será la base del agente.',
          '**Día 3: define cuándo pasa a una persona.** Lista los temas que nunca se automatizan (quejas, plata, excepciones) y el horario en que alguien responde de verdad.',
          '**Día 4: mide la línea base.** Cuántos mensajes llegan al día, cuánto tarda la primera respuesta y cuántos quedan sin contestar después de las 6 p. m.',
          '**Día 5: escoge el piloto.** Un solo tipo de consulta, por ejemplo preguntas frecuentes fuera de horario.',
        ] },
        { type: 'p', text: 'Con eso ya puedes escoger la herramienta. Si el volumen es bajo, la app de WhatsApp Business con respuestas rápidas y mensajes de ausencia puede bastar por ahora. Si el volumen es alto o quieres un agente con IA, necesitas la plataforma empresarial de WhatsApp (API), casi siempre a través de un proveedor, conectada a un modelo como Claude, ChatGPT o Gemini, o al agente que ofrece la propia Meta. La elección depende de tus sistemas, tu presupuesto y los datos que va a tocar.' },
        { type: 'p', text: 'Durante el piloto, alguien del equipo debe leer las conversaciones todos los días. Es la única forma de ver dónde se confunde el agente y corregir las respuestas antes de ampliarlo.' },

        { type: 'h2', text: '¿Cuánto cobra Meta por los mensajes de WhatsApp Business?' },
        { type: 'p', text: 'Si vas por la API, tienes que entender cómo cobra Meta, porque acaba de cambiar. A septiembre de 2026, Meta cobra por mensaje. Los mensajes de plantilla (marketing, utilidad y autenticación) tienen tarifa por país, y Colombia tiene la suya.' },
        { type: 'p', text: 'El cambio importante es este: desde el 1 de octubre de 2026, las respuestas dentro de la ventana de atención de 24 horas, que no se cobraban desde noviembre de 2024, pasan a cobrarse por mensaje. Meta incluye 1.000 mensajes de servicio gratis al mes por número, y las empresas sin un medio de pago registrado dejan de poder enviar esos mensajes.' },
        { type: 'p', text: 'A eso súmale lo que cobra el proveedor de la plataforma y el consumo del modelo de IA. Antes de comprometerte, pídele al proveedor una estimación con tu volumen real, el que mediste el día 4, y revisa la tarifa vigente en la documentación de Meta.' },
        { type: 'p', text: 'Un detalle más: Meta exige el permiso (opt-in) del cliente antes de escribirle por iniciativa tuya. Que alguien te haya preguntado un precio no significa que acepte recibir promociones.' },

        { type: 'h2', text: '¿Qué pasa con los datos personales que llegan por WhatsApp?' },
        { type: 'p', text: 'Cada chat trae datos personales: nombre, número, dirección y a veces cédula o información de salud. La Ley 1581 de 2012 aplica igual que en cualquier otro canal, y la Circular Externa 002 de 2024 de la SIC pide que el tratamiento de datos en sistemas de IA sea idóneo, necesario, razonable y proporcional, con la privacidad pensada desde el diseño.' },
        { type: 'p', text: 'En WhatsApp, eso se ve así:' },
        { type: 'ul', items: [
          'El agente pide solo los datos que necesita para resolver la consulta.',
          'Nunca pide números de tarjeta ni claves por chat.',
          'El primer mensaje enlaza tu aviso de privacidad.',
          'Sabes dónde quedan guardadas las conversaciones, por cuánto tiempo y qué hace con ellas el proveedor de IA.',
        ] },
        { type: 'p', text: 'Esto es información general, no asesoría legal. Si manejas datos sensibles, como historias clínicas o información financiera, revísalo con tu abogado antes de conectar cualquier agente.' },

        { type: 'h2', text: '¿Vale la pena para tu empresa?' },
        { type: 'p', text: 'Si tu equipo pierde horas cada semana respondiendo lo mismo y los mensajes de la noche se quedan sin respuesta, probablemente sí. Si te llegan veinte mensajes al día y cada uno es distinto, quizá lo primero es ordenar las respuestas, no montar un agente.' },
        { type: 'p', text: 'En los dos casos el punto de partida es el mismo: saber qué te preguntan, escribir qué respondes y decidir qué nunca debe contestar una máquina.' },
        { type: 'cta' },
      ],
    },
    en: {
      title: 'WhatsApp customer service with AI: what to automate',
      metaDescription:
        'What an AI WhatsApp agent can answer for your business, what must stay with a person, and what Meta\'s new message charges mean for Colombian SMBs.',
      excerpt:
        'Your team answers the same WhatsApp questions all day and evening messages get lost. What an AI agent can handle, and what should stay with a person.',
      tags: ['AI for SMBs', 'WhatsApp automation', 'Business'],
      body: [
        { type: 'h2', text: 'Is your team answering the same WhatsApp questions all day?' },
        { type: 'p', text: 'It is Tuesday, 10 a.m. Your salesperson is putting together a quote and the phone keeps buzzing: "Is it in stock?", "How much is shipping to Medellín?", "What time do you close?", "Can you send me the location?". The quote gets left halfway, the same message gets pasted for the fifth time, and the work starts over.' },
        { type: 'p', text: 'At 7 p.m. another ten messages arrive. Nobody sees them until the next morning, and by then two of those customers have bought somewhere else.' },
        { type: 'p', text: 'This is not unusual. According to a HubSpot report on Colombia, 71% of sales teams use WhatsApp to prospect and reach customers, and 36% of service teams count it among their main support channels. Your customers are already there. What is missing is an orderly way to serve them.' },

        { type: 'h2', text: 'Why does the company WhatsApp become a bottleneck?' },
        { type: 'p', text: 'It is rarely a lack of effort. It comes down to how the channel was set up:' },
        { type: 'ul', items: [
          '**The number lives on one person\'s phone.** When that person is at lunch, on vacation or quits, service stops.',
          '**The answers are not written down.** Everyone replies their own way, sometimes with prices or terms that have already changed.',
          '**Everything arrives mixed together.** The opening-hours question, the 5-million-peso order and the angry complaint land in the same chat with the same priority.',
          '**Nothing is measured.** Nobody knows how many messages come in per day, how long the first reply takes or how many go unanswered.',
        ] },
        { type: 'p', text: 'An AI agent helps with the first and third points, but only if you fix the second one first. If your answers are not written down, the AI will improvise them.' },

        { type: 'h2', text: 'What can an AI WhatsApp agent answer?' },
        { type: 'p', text: 'A well-configured agent works for conversations that follow clear rules and rely on information you already have. These are the cases where it tends to pay off:' },
        { type: 'ul', items: [
          '**FAQs:** hours, location, payment methods, delivery times, return policies. It answers from a document you approve, not from what the model "thinks".',
          '**Stock and catalog prices:** as long as it checks a real source such as your inventory, a spreadsheet or your sales system.',
          '**Lead qualification:** it asks what the customer needs, by when, in which city and with what budget, then hands your salesperson a summary ready to close.',
          '**Booking appointments or visits:** it offers open slots from your calendar and confirms.',
          '**Order status:** it looks up the order or tracking number and replies with the data from your system.',
          '**After hours:** it covers the basics at night and on weekends and leaves the rest organized for the morning.',
        ] },
        { type: 'tip', title: 'If it is not in the source, it does not say it', text: 'Set up the agent to answer only from your documents and systems. If it cannot find the data, it should say so and hand the chat to a person, never make up a price or a date.' },

        { type: 'h2', text: 'What should you not automate in WhatsApp customer service?' },
        { type: 'p', text: 'This is the part many vendors skip. In some conversations a fast but wrong answer costs more than a slow one. These should go to a person from the first message:' },
        { type: 'ul', items: [
          '**Complaints.** An upset customer needs someone who listens and has the authority to fix things. An automated reply, however polite, usually makes it worse.',
          '**Money:** refunds, discounts, price changes, payment arrangements or exceptions to your policy.',
          '**Health, legal or financial questions** where the answer depends on the specific case. The agent can take the request; someone qualified gives the answer.',
          '**Negotiations and large sales.** The agent qualifies and organizes; your team closes.',
          '**Anything the AI cannot verify** against your data.',
        ] },
        { type: 'p', text: 'This is not only good practice. The WhatsApp Business Messaging Policy requires that, if you automate service, customers have a quick, clear way to reach a person: in the same chat, by phone, by email or on your website.' },
        { type: 'p', text: 'Also, since January 15, 2026, Meta does not allow general-purpose AI chatbots on the WhatsApp Business Platform (the API), meaning assistants that chat about any topic. Agents focused on business tasks, such as customer service, orders or appointments, are still allowed. For a small business the takeaway is simple: your agent talks about your business and nothing else.' },
        { type: 'tip', title: 'Tell customers who they are talking to', text: 'Make the first message say it is an automated assistant and explain how to ask for a person. It is more honest and cuts frustration when a case gets complicated.' },

        { type: 'h2', text: 'How can you start automating WhatsApp this week?' },
        { type: 'p', text: 'You do not need a full agent to start. You can take these steps over the next five days:' },
        { type: 'ul', items: [
          '**Day 1: count the questions.** Go through the last two weeks of chats and write down the ten questions that repeat the most.',
          '**Day 2: write the approved answers.** A short document with each answer, the current price or condition, and who approved it. This becomes the agent\'s knowledge base.',
          '**Day 3: define when a person takes over.** List the topics that are never automated (complaints, money, exceptions) and the hours when a real person replies.',
          '**Day 4: measure the baseline.** How many messages arrive per day, how long the first reply takes and how many are still unanswered after 6 p.m.',
          '**Day 5: pick the pilot.** One type of request, for example FAQs after hours.',
        ] },
        { type: 'p', text: 'Then you can choose the tool. If volume is low, the WhatsApp Business app with quick replies and away messages may be enough for now. If volume is high or you want an AI agent, you need the WhatsApp Business Platform (API), usually through a provider, connected to a model such as Claude, ChatGPT or Gemini, or to the agent Meta itself offers. The choice depends on your systems, your budget and which data it will touch.' },
        { type: 'p', text: 'During the pilot, someone on the team should read the conversations every day. It is the only way to see where the agent gets confused and to fix the answers before expanding it.' },

        { type: 'h2', text: 'How much does Meta charge for WhatsApp Business messages?' },
        { type: 'p', text: 'If you go with the API, you need to understand how Meta charges, because it just changed. As of September 2026, Meta charges per message. Template messages (marketing, utility and authentication) are priced by country, and Colombia has its own rate.' },
        { type: 'p', text: 'The key change: starting October 1, 2026, replies inside the 24-hour customer service window, which had been free since November 2024, are charged per message. Meta includes 1,000 free service messages per month per phone number, and businesses without a payment method on file can no longer send those messages.' },
        { type: 'p', text: 'On top of that, add the platform provider\'s fee and the AI model usage. Before you commit, ask the provider for an estimate based on your real volume, the one you measured on day 4, and check the current rate in Meta\'s documentation.' },
        { type: 'p', text: 'One more detail: Meta requires the customer\'s opt-in before you message them on your own initiative. Someone asking you for a price is not permission to send them promotions.' },

        { type: 'h2', text: 'What about the personal data that comes in through WhatsApp?' },
        { type: 'p', text: 'Every chat carries personal data: name, number, address and sometimes ID numbers or health information. Colombia\'s Law 1581 of 2012 applies just as it does on any other channel, and the SIC\'s External Circular 002 of 2024 asks that personal data in AI systems be handled in a way that is suitable, necessary, reasonable and proportionate, with privacy built in from the design stage.' },
        { type: 'p', text: 'On WhatsApp, that looks like this:' },
        { type: 'ul', items: [
          'The agent asks only for the data it needs to resolve the request.',
          'It never asks for card numbers or passwords in the chat.',
          'The first message links to your privacy notice.',
          'You know where conversations are stored, for how long, and what the AI provider does with them.',
        ] },
        { type: 'p', text: 'This is general information, not legal advice. If you handle sensitive data such as medical records or financial information, review it with your lawyer before connecting any agent.' },

        { type: 'h2', text: 'Is it worth it for your company?' },
        { type: 'p', text: 'If your team loses hours every week answering the same things and evening messages go unanswered, probably yes. If you get twenty messages a day and each one is different, what you need first may be organized answers, not an agent.' },
        { type: 'p', text: 'Either way, the starting point is the same: know what customers ask, write down what you answer and decide what a machine should never answer.' },
        { type: 'cta' },
      ],
    },
    sources: [
      { title: 'HubSpot vía Tecnogus: uso de WhatsApp en equipos de marketing, ventas y servicio en Colombia', url: 'https://www.tecnogus.com.co/54-de-los-equipos-de-marketing-en-colombia-ya-utilizan-whatsapp-para-conectar-con-sus-clientes/' },
      { title: 'Meta for Developers: Pricing on the WhatsApp Business Platform', url: 'https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing' },
      { title: 'Meta for Developers: Upcoming pricing updates for Meta Business Agent, service and utility messages', url: 'https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages' },
      { title: 'Meta for Developers: Get opt-in for WhatsApp', url: 'https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in' },
      { title: 'WhatsApp Business Messaging Policy', url: 'https://whatsappbusiness.com/policy/' },
      { title: 'TechCrunch: WhatsApp changes its terms to bar general-purpose chatbots from its platform', url: 'https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform' },
      { title: 'Función Pública: Ley 1581 de 2012', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981' },
      { title: 'SIC: Circular Externa 002 de 2024 (datos personales e IA)', url: 'https://sedeelectronica.sic.gov.co/transparencia/normativa/circular-externa-2-de-2024-de-la-superintendencia-de-industria-y-comercio-lineamientos-sobre-el-tratamiento-de-datos' },
    ],
  },
  {
    slug: 'ia-para-pymes-colombia-por-donde-empezar',
    date: '2026-09-22',
    readingMinutes: 6,
    cover: '/images/bogota.jpg',
    es: {
      title: 'IA para pymes en Colombia: por dónde empezar',
      metaDescription:
        'IA para pymes en Colombia sin perder plata: cómo escoger el primer proceso, medir el ahorro y cuidar los datos de tus clientes bajo la Ley 1581.',
      excerpt:
        'Tu equipo ya usa ChatGPT, cada quien a su manera. Así pasas de ese uso suelto a un primer flujo con IA que ahorra horas y que puedes medir.',
      tags: ['IA para pymes', 'Guía práctica'],
      body: [
        { type: 'h2', text: '¿Cuántas empresas en Colombia ya usan IA?' },
        { type: 'p', text: 'Según Cintel, cerca del 40 % de las empresas colombianas ya usa alguna herramienta de IA. Pero usar no es lo mismo que aprovechar: solo alrededor de una de cada diez la tiene metida en procesos del negocio, y otro 40 % dice que no tiene planes de adoptarla.' },
        { type: 'p', text: 'En la práctica, eso se ve así: el gerente usa ChatGPT para redactar correos, alguien en ventas lo usa para cotizaciones y nadie sabe qué datos de clientes se están pegando ahí. Hay uso, pero no hay método.' },

        { type: 'h2', text: '¿Qué proceso conviene automatizar primero?' },
        { type: 'p', text: 'El primer proyecto no debería ser el más ambicioso, sino el más aburrido. Busca una tarea que cumpla tres condiciones:' },
        { type: 'ul', items: [
          '**Se repite todas las semanas**, idealmente todos los días.',
          '**Sigue reglas claras** que alguien podría escribir en una hoja.',
          '**Se puede medir**: horas invertidas, errores, tiempo de respuesta.',
        ] },
        { type: 'p', text: 'Ejemplos típicos en una pyme: responder las mismas preguntas por WhatsApp, pasar datos de facturas o PDFs a una hoja de cálculo, redactar contratos a partir de una plantilla o resumir reuniones y dejar las tareas asignadas.' },
        { type: 'tip', title: 'La prueba de la hoja de papel', text: 'Si no puedes explicar el proceso en una hoja, la IA tampoco lo va a entender. Primero escribe los pasos; después decides qué parte se automatiza.' },

        { type: 'h2', text: '¿Cómo saber si la IA sí está ahorrando tiempo?' },
        { type: 'p', text: 'Mide antes de empezar. Durante una semana, anota cuánto tarda la tarea y cuántos errores o reprocesos genera. Con ese número de base, cualquier mejora se puede comprobar en vez de suponerla.' },
        { type: 'p', text: 'En 77Rentals lo hicimos así con los contratos de arrendamiento: medimos cuánto tomaba armar cada uno a mano y lo comparamos con el flujo nuevo, que genera el documento y lo envía a firma electrónica. La diferencia se ve en la agenda, no en una presentación.' },

        { type: 'h2', text: '¿Qué dice la ley sobre usar IA con datos de clientes?' },
        { type: 'p', text: 'En Colombia, los datos personales se rigen por la Ley 1581 de 2012. Además, la Superintendencia de Industria y Comercio publicó la Circular Externa 002 de 2024 con lineamientos para tratar datos personales en sistemas de inteligencia artificial.' },
        { type: 'p', text: 'Traducido a la operación: define qué información puede entrar a una herramienta de IA y cuál no, usa cuentas empresariales en vez de cuentas personales y deja por escrito para qué usas los datos. No es burocracia; es lo que te protege si un cliente pregunta.' },
        { type: 'tip', title: 'Una regla simple para el equipo', text: 'Nada con cédula, número de cuenta o datos de salud va a un chat de IA gratuito. Si el proceso lo necesita, se hace con una herramienta configurada para eso.' },

        { type: 'h2', text: '¿Hay que contratar un desarrollador?' },
        { type: 'p', text: 'No siempre. Muchos flujos se arman con las herramientas que ya pagas, como Google Workspace o Microsoft 365, más un asistente de IA bien configurado. Cuando sí hace falta código, herramientas como Claude Code o Cursor permiten que un equipo pequeño construya en semanas lo que antes tomaba meses.' },
        { type: 'p', text: 'Lo que sí necesitas es a alguien que entienda el proceso y la tecnología al mismo tiempo. Esa es la parte que suele faltar.' },

        { type: 'h2', text: 'Un plan de 30 días para empezar' },
        { type: 'ul', items: [
          '**Semana 1:** lista las tareas repetitivas y mide las tres que más tiempo consumen.',
          '**Semana 2:** escoge una, escribe el proceso y define qué datos puede tocar la IA.',
          '**Semana 3:** arma un piloto con dos o tres personas del equipo.',
          '**Semana 4:** compara contra la medición inicial y decide si se escala o se ajusta.',
        ] },
        { type: 'cta' },
      ],
    },
    en: {
      title: 'AI for small businesses in Colombia: where to start',
      metaDescription:
        'AI for Colombian small businesses without wasting money: pick the first process, measure the savings and protect customer data under Law 1581.',
      excerpt:
        'Your team already uses ChatGPT, each person in their own way. Here is how to go from scattered use to a first AI workflow that saves hours you can measure.',
      tags: ['AI for SMBs', 'Practical guide'],
      body: [
        { type: 'h2', text: 'How many Colombian companies already use AI?' },
        { type: 'p', text: 'According to Cintel, about 40% of Colombian companies already use some AI tool. Using it is not the same as getting value from it: only around one in ten has AI built into business processes, and another 40% say they have no plans to adopt it.' },
        { type: 'p', text: 'In practice it looks like this: the manager uses ChatGPT for emails, someone in sales uses it for quotes, and nobody knows which customer data is being pasted in. There is usage, but no method.' },

        { type: 'h2', text: 'Which process should you automate first?' },
        { type: 'p', text: 'Your first project should not be the most ambitious one. It should be the most boring. Look for a task that meets three conditions:' },
        { type: 'ul', items: [
          '**It repeats every week**, ideally every day.',
          '**It follows clear rules** someone could write on one page.',
          '**It can be measured**: hours spent, errors, response time.',
        ] },
        { type: 'p', text: 'Typical examples in a small business: answering the same WhatsApp questions, moving data from invoices or PDFs into a spreadsheet, drafting contracts from a template, or summarizing meetings and assigning the follow-ups.' },
        { type: 'tip', title: 'The one-page test', text: 'If you cannot explain the process on one page, AI will not understand it either. Write the steps first, then decide which part to automate.' },

        { type: 'h2', text: 'How do you know AI is actually saving time?' },
        { type: 'p', text: 'Measure before you start. For one week, log how long the task takes and how many errors or redos it causes. With that baseline, any improvement can be checked instead of assumed.' },
        { type: 'p', text: 'At 77Rentals we did exactly this with lease contracts: we timed how long each one took by hand and compared it with the new flow, which generates the document and sends it for e-signature. The difference shows up in the calendar, not in a slide deck.' },

        { type: 'h2', text: 'What does Colombian law say about AI and customer data?' },
        { type: 'p', text: 'In Colombia, personal data is governed by Law 1581 of 2012. On top of that, the Superintendence of Industry and Commerce (SIC) issued External Circular 002 of 2024 with guidelines for handling personal data in AI systems.' },
        { type: 'p', text: 'In day-to-day terms: decide which information may go into an AI tool and which may not, use business accounts instead of personal ones, and write down what you use the data for. That is not red tape; it is what protects you when a customer asks.' },
        { type: 'tip', title: 'One simple rule for the team', text: 'Nothing with ID numbers, bank accounts or health data goes into a free AI chat. If the process needs it, it runs on a tool configured for that.' },

        { type: 'h2', text: 'Do you need to hire a developer?' },
        { type: 'p', text: 'Not always. Many workflows can be built with tools you already pay for, like Google Workspace or Microsoft 365, plus a well-configured AI assistant. When code is needed, tools like Claude Code or Cursor let a small team build in weeks what used to take months.' },
        { type: 'p', text: 'What you do need is someone who understands both the process and the technology. That is usually the missing piece.' },

        { type: 'h2', text: 'A 30-day plan to get started' },
        { type: 'ul', items: [
          '**Week 1:** list the repetitive tasks and measure the three that take the most time.',
          '**Week 2:** pick one, write down the process and define which data AI may touch.',
          '**Week 3:** run a pilot with two or three people on the team.',
          '**Week 4:** compare against the baseline and decide whether to scale or adjust.',
        ] },
        { type: 'cta' },
      ],
    },
    sources: [
      { title: 'Cintel vía Impacto TIC: adopción de IA en empresas de Colombia', url: 'https://impactotic.co/inteligencia-artificial/adopcion-de-ia-en-empresas-colombia-andicom/' },
      { title: 'El País: estudio de AWS sobre adopción de IA en empresas colombianas', url: 'https://www.elpais.com.co/colombia/cada-5-minutos-una-empresa-colombiana-adopta-ia-asi-lo-revela-el-nuevo-estudio-de-aws-esto-es-lo-que-hay-detras-de-la-cifra-3048.html' },
      { title: 'Función Pública: Ley 1581 de 2012', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981' },
      { title: 'SIC: Circular Externa 002 de 2024 (datos personales e IA)', url: 'https://sedeelectronica.sic.gov.co/transparencia/normativa/circular-externa-2-de-2024-de-la-superintendencia-de-industria-y-comercio-lineamientos-sobre-el-tratamiento-de-datos' },
    ],
  },
];

// Spanish at /ai/blog/, English at /en/ai/blog/ (trailing slash matches the
// prerendered directory layout).
export const aiBlogPath = (lang: 'es' | 'en', slug?: string) =>
  `${lang === 'en' ? '/en' : ''}/ai/blog/${slug ? `${slug}/` : ''}`;

export const getAiPostBySlug = (slug: string | undefined) =>
  aiBlogPosts.find((p) => p.slug === slug);

export const aiBlogCopy = {
  es: {
    eyebrow: 'Blog · IA para empresas',
    title: 'Problemas reales, soluciones con IA',
    subtitle: 'Guías prácticas para pymes colombianas que quieren usar IA con método, sin humo.',
    minRead: 'min de lectura',
    readMore: 'Leer',
    back: 'Volver al blog',
    backToAi: 'Consultoría IA',
    sources: 'Fuentes',
    more: 'Más artículos',
    notFound: 'No encontramos este artículo.',
    ctaTitle: '¿Quieres aplicarlo en tu empresa?',
    ctaText: 'Cuéntame qué proceso te quita más tiempo y te digo por dónde empezaría.',
    ctaButton: 'Escríbeme por WhatsApp',
    ctaSecondary: 'Ver servicios',
  },
  en: {
    eyebrow: 'Blog · AI for business',
    title: 'Real problems, AI solutions',
    subtitle: 'Practical guides for Colombian companies that want to use AI with a method, not hype.',
    minRead: 'min read',
    readMore: 'Read',
    back: 'Back to blog',
    backToAi: 'AI consulting',
    sources: 'Sources',
    more: 'More articles',
    notFound: 'We could not find this article.',
    ctaTitle: 'Want to apply this in your company?',
    ctaText: 'Tell me which process eats the most time and I will tell you where I would start.',
    ctaButton: 'Message me on WhatsApp',
    ctaSecondary: 'See services',
  },
} as const;
