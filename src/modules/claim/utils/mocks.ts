import { ClaimDocument } from "../../tools/draftClaim/types";

export const mockClaims: Record<string, ClaimDocument> = {
  caso1: {
    id: "CLM-2026-001",
    regulador: "SUPEN",
    fecha_generacion: "2026-05-06",
    identificacion_reclamante: { nombre: "María Rojas" },
    identificacion_reclamado: { entidad: "AFP Habitat" },
    hechos: [
      "Descuento mensual de $14.200 no autorizado bajo el concepto de 'comisión adicional'.",
      "El descuento se ha repetido durante 3 meses consecutivos.",
      "AFP Habitat no entregó explicación satisfactoria en sucursal."
    ],
    normativa_invocada: [
      "DL 3.500 Art. 29",
      "Circular SUPEN 1.998"
    ],
    peticion_concreta: "Restitución de $42.600 cobrados indebidamente y el cese inmediato de dicho cobro.",
    documento_markdown: `
# Reclamo Formal ante Superintendencia de Pensiones (SUPEN)

**Fecha:** 6 de Mayo, 2026  
**Reclamante:** María Rojas  
**Entidad Reclamada:** AFP Habitat  

## I. Hechos
1. He detectado un descuento mensual de $14.200 no autorizado bajo el concepto de "comisión adicional" en mi liquidación de pensión (modalidad retiro programado).
2. El descuento se ha repetido durante 3 meses consecutivos.
3. La entidad AFP Habitat no entregó una explicación satisfactoria al ser consultada en sucursal.

## II. Normativa Invocada
Este reclamo se ampara en las siguientes normativas vigentes:
- **DL 3.500 Art. 29**: Regulación sobre el cobro de comisiones por parte de las AFP.
- **Circular SUPEN 1.998**: Instrucciones sobre la transparencia e información de comisiones.

## III. Petición Concreta
Solicito la restitución total de **$42.600** cobrados indebidamente y el cese inmediato de dicho cobro en mis futuras liquidaciones.
    `.trim()
  },
  caso2: {
    id: "CLM-2026-002",
    regulador: "SERNAC",
    fecha_generacion: "2026-05-06",
    identificacion_reclamante: { nombre: "Camila Soto" },
    identificacion_reclamado: { entidad: "Hites" },
    hechos: [
      "Contratación de crédito de consumo por $1.500.000.",
      "La cuota cobrada es $15.800 más alta de lo informado verbalmente.",
      "CAE aplicado es del 38% y no del 28% como se indicó al momento de la venta."
    ],
    normativa_invocada: [
      "Ley 19.496 Art. 17",
      "Ley 20.555 Art. 17B",
      "Ley 21.398 (Pro Consumidor)"
    ],
    peticion_concreta: "Recálculo de la deuda aplicando la CAE del 28% pactada verbalmente y la devolución de los cobros excedentes.",
    documento_markdown: `
# Reclamo Formal ante SERNAC Financiero

**Fecha:** 6 de Mayo, 2026  
**Reclamante:** Camila Soto  
**Entidad Reclamada:** Hites  

## I. Hechos
1. Contratación de un crédito de consumo por un monto de $1.500.000.
2. Al momento de pagar la primera cuota, detecto que el monto es $15.800 más alto de lo informado en caja.
3. El contrato estipula una CAE del 38%, difiriendo del 28% informado verbalmente antes de firmar.

## II. Normativa Invocada
- **Ley 19.496 Art. 17**: Derechos del consumidor y deber de información veraz y oportuna.
- **Ley 20.555 Art. 17B**: SERNAC Financiero y transparencia en el crédito.
- **Ley 21.398**: Ley Pro Consumidor, relativa a cláusulas abusivas y publicidad engañosa.

## III. Petición Concreta
Exijo el recálculo inmediato de mi deuda aplicando la CAE del 28% originalmente informada y la devolución de los intereses cobrados en exceso.
    `.trim()
  }
};
