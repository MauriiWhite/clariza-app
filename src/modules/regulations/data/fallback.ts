// Corpus mock del marco regulatorio chileno relevante para Clariza.
//
// IMPORTANTE — anti-alucinacion regulatoria (gate de descalificacion del Lab):
// El campo `text` es PARÁFRASIS SEGURA basada en el contenido publicado en
// BCN o CMF. NO es texto literal copiado salvo que se indique. Cada chunk
// incluye `url` para que el ciudadano (y el jurado) puedan verificar.
// `plainLanguageSummary` es traduccion a lenguaje ciudadano.
//
// Cuando tengamos pgvector + ingesta real (Paso 6+), reemplazamos esto por
// la consulta a Supabase. La interfaz no cambia.

import type { RegulationChunk } from "@/modules/regulations/types";

export const REGULATION_CORPUS: RegulationChunk[] = [
  // ============================================================
  // DL 3.500 — Sistema de pensiones · AFP · SUPEN
  // ============================================================
  {
    sourceId: "DL_3500",
    source: "DL 3.500",
    article: "Art. 29",
    text: "Las Administradoras de Fondos de Pensiones tendrán derecho a una retribución establecida sobre la base de comisiones de cargo de los afiliados, según las reglas y limitaciones que establece este decreto ley. Las comisiones deben ser informadas al afiliado de manera clara y previa.",
    plainLanguageSummary:
      "Las AFP solo pueden cobrar comisiones que estén autorizadas y previamente informadas al afiliado. Comisiones no informadas o no autorizadas pueden ser disputadas ante SUPEN.",
    url: "https://www.bcn.cl/leychile/navegar?idNorma=7147",
    keywords: [
      "afp",
      "pension",
      "comision",
      "comisiones",
      "comision adicional",
      "cobro",
      "descuento",
      "habitat",
      "provida",
      "cuprum",
      "modelo",
      "planvital",
      "capital",
      "supen",
      "superintendencia de pensiones",
      "afiliado",
      "fondo de pensiones",
      "cuenta obligatoria",
    ],
  },
  // ============================================================
  // Ley 19.496 — Derechos del consumidor (base SERNAC)
  // ============================================================
  {
    sourceId: "LEY_19496",
    source: "Ley 19.496",
    article: "Art. 17",
    text: "Los contratos de adhesión deberán estar escritos de modo claramente legible, en idioma castellano y los proveedores no podrán incluir cláusulas abusivas en perjuicio del consumidor. La falta de claridad en la información esencial del producto o servicio puede ser causal de nulidad parcial.",
    plainLanguageSummary:
      "Tu contrato tiene que estar en castellano, ser legible, y no incluir cláusulas abusivas. Si la información clave no fue clara antes de firmar, podés reclamar la nulidad de esas cláusulas en SERNAC.",
    url: "https://www.bcn.cl/leychile/navegar?idNorma=61438",
    keywords: [
      "consumidor",
      "contrato",
      "contrato de adhesion",
      "clausula",
      "clausulas abusivas",
      "letra chica",
      "informacion",
      "transparencia",
      "sernac",
      "credito",
      "retail",
      "publicidad enganosa",
      "abuso",
    ],
  },
  // ============================================================
  // Ley 20.555 — SERNAC Financiero
  // ============================================================
  {
    sourceId: "LEY_20555",
    source: "Ley 20.555",
    article: "Art. 17 B",
    text: "Los contratos de adhesión de productos y servicios financieros deben informar de forma destacada la Carga Anual Equivalente (CAE), el costo total del crédito, los intereses moratorios y cualquier otro cargo. La omisión o presentación engañosa de estos elementos faculta al consumidor a solicitar la nulidad o el recálculo del contrato.",
    plainLanguageSummary:
      "Si firmaste un crédito en banco, retail o fintech, te tienen que decir clarísimo el CAE, los intereses extra por atraso y cualquier otro cobro. Si te ocultaron o cambiaron esa info, podés pedir devolución o recálculo en SERNAC.",
    url: "https://www.bcn.cl/leychile/navegar?idNorma=1024266",
    keywords: [
      "credito",
      "consumidor financiero",
      "sernac financiero",
      "cae",
      "carga anual equivalente",
      "interes",
      "intereses",
      "moratorio",
      "tasa",
      "credito de consumo",
      "tarjeta",
      "retail",
      "publicidad",
      "engano",
      "cobro indebido",
      "comision",
    ],
  },
  // ============================================================
  // Ley 21.398 — Pro Consumidor
  // ============================================================
  {
    sourceId: "LEY_21398",
    source: "Ley 21.398",
    article: "Art. 17 D",
    text: "Los proveedores de servicios financieros deben entregar el certificado de deuda al consumidor en un plazo máximo de 5 días hábiles desde su solicitud, sin costo. La negativa o demora injustificada faculta al consumidor a presentar reclamo ante SERNAC.",
    plainLanguageSummary:
      "Si pediste un certificado de deuda al banco o financiera (para portarte o renegociar), te lo tienen que dar gratis y en 5 días hábiles. Si no lo hacen, es reclamo a SERNAC.",
    url: "https://www.bcn.cl/leychile/navegar?idNorma=1170464",
    keywords: [
      "certificado de deuda",
      "portabilidad",
      "renegociacion",
      "credito",
      "5 dias habiles",
      "pro consumidor",
      "sernac",
      "demora",
      "negativa",
    ],
  },
  // ============================================================
  // Ley 21.234 — Limitacion de responsabilidad ante fraudes con tarjetas
  // ============================================================
  {
    sourceId: "LEY_21234",
    source: "Ley 21.234",
    article: "Art. 5",
    text: "Tratándose de operaciones desconocidas por el titular, el emisor del medio de pago será responsable de restituir los fondos al cliente. La carga de la prueba sobre dolo o culpa grave del titular recae en el emisor. La autenticación con clave dinámica u otros mecanismos no exime de esta responsabilidad por sí sola.",
    plainLanguageSummary:
      "Si alguien clonó tu tarjeta o usó tu cuenta sin autorización y vos avisaste al banco, el banco tiene que devolverte la plata. Es el banco quien debe probar que actuaste con dolo o negligencia grave — no al revés. Que la transacción tuviera 3DSecure no los exime.",
    url: "https://www.bcn.cl/leychile/navegar?idNorma=1147562",
    keywords: [
      "fraude",
      "tarjeta",
      "tarjeta clonada",
      "operacion desconocida",
      "phishing",
      "estafa",
      "robo",
      "transaccion no reconocida",
      "3dsecure",
      "clave dinamica",
      "banco",
      "emisor",
      "cmf",
      "restitucion",
      "devolucion",
    ],
  },
  // ============================================================
  // Ley 21.521 — Fintec (Open Finance, registro)
  // ============================================================
  {
    sourceId: "LEY_21521",
    source: "Ley 21.521",
    article: "Art. 5",
    text: "Solo pueden prestar servicios financieros tecnológicos en Chile las entidades inscritas en el Registro de Prestadores de Servicios Financieros (RPSF) administrado por la CMF. Operar sin inscripción previa constituye infracción a la ley y puede dar lugar a sanciones administrativas y penales.",
    plainLanguageSummary:
      "Cualquier app o fintech que opere en Chile tiene que estar registrada en la CMF. Si no aparece en el registro oficial, es una alerta roja: probablemente es ilegal y puede ser estafa.",
    url: "https://www.bcn.cl/leychile/navegar?idNorma=1187323",
    keywords: [
      "fintec",
      "fintech",
      "registro",
      "rpsf",
      "cmf",
      "no autorizada",
      "no autorizado",
      "ilegal",
      "estafa",
      "app",
      "open finance",
      "ley fintech",
      "ley 21521",
      "inscripcion",
    ],
  },
  // ============================================================
  // Ley 21.680 — Registro Consolidado de Deudas (REDEC)
  // ============================================================
  {
    sourceId: "LEY_21680",
    source: "Ley 21.680",
    article: "Art. 4",
    text: "El Registro Consolidado de Deudas (REDEC), administrado por la CMF, contiene la información de obligaciones financieras de cada persona. Los deudores tienen derecho a acceder gratuitamente a su propio reporte y a solicitar la corrección de información errónea o desactualizada.",
    plainLanguageSummary:
      "Tenés derecho a ver gratis qué deudas figuran a tu nombre en el REDEC de la CMF. Si hay un error o data vieja, podés pedir que la corrijan.",
    url: "https://www.bcn.cl/leychile/navegar?idNorma=1209293",
    keywords: [
      "redec",
      "registro consolidado de deudas",
      "deuda",
      "deudas",
      "reporte de deuda",
      "informacion erronea",
      "correccion",
      "cmf",
      "ley 21680",
    ],
  },
  // ============================================================
  // Circular SUPEN — Comisiones AFP (referencia complementaria a DL 3.500)
  // ============================================================
  {
    sourceId: "CIRCULAR_SUPEN_1998",
    source: "Circular SUPEN",
    article: "N° 1.998",
    text: "Las Administradoras deben informar a sus afiliados, en cada cartola y en la web institucional, el monto exacto de la comisión cobrada y su justificación. Cualquier comisión no informada previamente puede ser objeto de reclamo formal por el afiliado ante la Superintendencia de Pensiones.",
    plainLanguageSummary:
      "La AFP tiene que mostrarte la comisión claramente en cada cartola. Si aparece un cobro que no entendés o que no fue informado antes, es derecho del afiliado reclamar a SUPEN.",
    url: "https://www.spensiones.cl/portal/institucional/594/w3-channel.html",
    keywords: [
      "afp",
      "comision",
      "cartola",
      "supen",
      "circular",
      "afiliado",
      "transparencia afp",
      "cobro afp",
    ],
  },
];
