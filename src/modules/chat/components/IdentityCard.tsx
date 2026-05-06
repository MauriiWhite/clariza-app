// Identity card del afectado — quien es la persona que reclama.
// Disenado para no bloquear el flujo: empieza colapsado con un boton "Soy yo",
// y se expande inline con 3 campos minimos (nombre, RUT, email).
//
// El reclamo final se puede generar sin esto en modo demo, pero para enviarlo
// real hay que tener al menos nombre + RUT.

"use client";

import { useState } from "react";

export interface Identity {
  fullName: string;
  rut: string;
  email: string;
}

const EMPTY_IDENTITY: Identity = { fullName: "", rut: "", email: "" };

interface IdentityCardProps {
  identity: Identity;
  onChange: (next: Identity) => void;
}

export function IdentityCard({ identity, onChange }: IdentityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasAnyData =
    identity.fullName.length > 0 ||
    identity.rut.length > 0 ||
    identity.email.length > 0;

  return (
    <div className="rounded-md bg-paper/70 border border-border">
      {/* Header — toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-paper transition-colors rounded-md"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-clay/10 text-clay">
            <PersonIcon />
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink">
              {hasAnyData
                ? identity.fullName || "Tus datos"
                : "Soy yo"}
            </span>
            <span className="block text-xs text-ink-3">
              {hasAnyData
                ? "Toca para editar"
                : "Opcional · sirve para que el reclamo lleve tus datos"}
            </span>
          </span>
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Inputs — solo cuando esta expandido */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border">
          <Field
            label="Nombre completo"
            placeholder="Ej: María Rojas Pérez"
            value={identity.fullName}
            onChange={(v) => onChange({ ...identity, fullName: v })}
            autoComplete="name"
          />
          <Field
            label="RUT"
            placeholder="Ej: 8.123.456-7"
            value={identity.rut}
            onChange={(v) => onChange({ ...identity, rut: v })}
            autoComplete="off"
            inputMode="text"
          />
          <Field
            label="Email (para recordatorios)"
            placeholder="tucorreo@ejemplo.cl"
            value={identity.email}
            onChange={(v) => onChange({ ...identity, email: v })}
            autoComplete="email"
            type="email"
          />
          <p className="text-xs text-ink-3 leading-relaxed pt-1">
            Tus datos quedan en este dispositivo hasta que toques el botón
            de generar reclamo. Clariza no envía nada sin tu permiso.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper para los inputs — labels arriba, no placeholder-as-label.
function Field({
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
  inputMode,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  autoComplete?: string;
  inputMode?: "text" | "email" | "numeric";
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-ink-2 mb-1">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full px-3 py-2 rounded-md border border-border bg-paper focus:outline-none focus:border-clay text-sm"
      />
    </label>
  );
}

function PersonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export { EMPTY_IDENTITY };
