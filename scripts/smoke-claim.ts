// Smoke test del builder de reclamos.
// Genera un reclamo de cada regulador y muestra el markdown resultante.

import { buildClaimDocument } from "../src/modules/tools/draftClaim/services/builder";

const cases = [
  {
    label: "SUPEN — Maria Rojas",
    input: {
      regulator: "SUPEN" as const,
      claimant: { fullName: "María Rojas", rut: "8.123.456-7" },
      respondent: { entity: "AFP Habitat" },
      facts: [
        "Desde enero de 2026, AFP Habitat me descuenta $14.200 mensuales bajo el concepto 'comisión adicional'.",
        "Nunca fui informada ni autoricé este cobro.",
        "He acumulado $42.600 en cobros no autorizados.",
      ],
      invokedRegulations: [
        "DL 3.500 Art. 29",
        "Circular SUPEN N° 1.998",
      ],
      petition:
        "Solicito la restitución total de $42.600 cobrados indebidamente y el cese inmediato del cobro.",
    },
  },
  {
    label: "SERNAC — Camila Soto",
    input: {
      regulator: "SERNAC" as const,
      claimant: { fullName: "Camila Soto" },
      respondent: { entity: "Hites" },
      facts: [
        "Tomé un crédito de consumo por $1.500.000 en Hites.",
        "Al primer pago la cuota fue $15.800 más alta que lo informado en caja.",
        "El CAE real es 38%, no el 28% que se me informó verbalmente.",
      ],
      invokedRegulations: [
        "Ley 19.496 Art. 17",
        "Ley 20.555 Art. 17 B",
        "Ley 21.398 Art. 17 D",
      ],
      petition:
        "Solicito recálculo de la deuda al CAE 28% pactado verbalmente y devolución de cobros excedentes.",
    },
  },
  {
    label: "TRIBUNALES — Javiera Mella",
    input: {
      regulator: "TRIBUNALES" as const,
      claimant: { fullName: "Javiera Mella" },
      respondent: { entity: "App PayDay (no autorizada)" },
      facts: [
        "Transferí $320.000 a la app PayDay basándome en su publicidad en redes sociales.",
        "Al intentar retirar, la app me pidió pagar un 'impuesto de salida' de $48.000.",
        "La empresa no responde mensajes hace 5 días.",
      ],
      invokedRegulations: [
        "Ley 21.521 Art. 5 (Fintec sin registro)",
        "Art. 467 Código Penal (estafa)",
      ],
      petition:
        "Solicito al Ministerio Público iniciar investigación por estafa y eventual congelamiento de cuentas asociadas a la app PayDay.",
    },
  },
];

for (const c of cases) {
  console.log(`\n========================================`);
  console.log(`CASO: ${c.label}`);
  console.log(`========================================\n`);
  const doc = buildClaimDocument(c.input);
  console.log(`ID: ${doc.id}`);
  console.log(`Regulador: ${doc.regulator}`);
  console.log(`Generado: ${doc.generatedAt}\n`);
  console.log(doc.documentMarkdown);
}
