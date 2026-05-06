// Re-export de los tipos canonicos que consume modules/diagnosis.
//
// La fuente de verdad vive en los modulos de las tools que los emiten:
//   - RegulatoryDiagnosis → @/modules/tools/classifyJurisdiction/types
//   - DeadlineSchedule    → @/modules/tools/calculateDeadlines/types
//
// Lo re-exportamos aca para que los components de modules/diagnosis hagan
// un solo import desde su propio modulo, sin tener que conocer la
// implementacion de las tools.

export type {
  OfficialChannel,
  Procedure,
  Regulator,
  RegulatoryDiagnosis,
  Severity,
} from "@/modules/tools/classifyJurisdiction/types";

export type {
  DeadlineMilestone,
  DeadlineSchedule,
} from "@/modules/tools/calculateDeadlines/types";
