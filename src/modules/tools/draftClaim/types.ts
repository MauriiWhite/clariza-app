export interface ClaimDocument {
  id: string;
  regulador: string;
  fecha_generacion: string;
  identificacion_reclamante: {
    nombre: string;
    rut?: string;
  };
  identificacion_reclamado: {
    entidad: string;
  };
  hechos: string[];
  normativa_invocada: string[];
  peticion_concreta: string;
  documento_markdown: string;
}
