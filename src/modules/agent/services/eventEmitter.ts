// Emisor de eventos de consola.
// Encapsula el patron "guardar evento + invocar callback" que el runner
// usa para alimentar la consola visible y cualquier otro consumidor.
//
// Ventajas vs una closure inline:
// - Reutilizable desde tests y desde futuros agentes paralelos.
// - Permite inspeccionar el historial completo en cualquier momento.
// - Hace el contrato del runner mas explicito.

import type { ConsoleEvent } from "@/modules/agent/types";

export class ConsoleEventEmitter {
  private readonly events: ConsoleEvent[] = [];

  constructor(private readonly onEvent?: (event: ConsoleEvent) => void) {}

  /** Registra el evento en el historial y notifica al callback si existe. */
  emit(event: ConsoleEvent): void {
    this.events.push(event);
    this.onEvent?.(event);
  }

  /** Devuelve una vista de solo lectura del historial completo del turno. */
  getEvents(): readonly ConsoleEvent[] {
    return this.events;
  }

  /** Limpia el historial. Util para reusar la instancia entre turnos en tests. */
  clear(): void {
    this.events.length = 0;
  }
}
