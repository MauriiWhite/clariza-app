// Layout compartido entre los pasos del flujo (/caso/accion, /caso/cerrado).
// Top bar + Stepper + slot de contenido. Asi cada pagina solo escribe su
// contenido especifico y no duplica chrome.

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Stepper } from "@/modules/case/components/Stepper";

const STEPS = [
  { id: 1, label: "Chat" },
  { id: 2, label: "Acción" },
  { id: 3, label: "Cerrado" },
];

interface CaseShellProps {
  currentStep: 2 | 3;
  completedSteps: number[];
  children: ReactNode;
  // wide=true expande el container a max-w-6xl para layouts con sidebar.
  // Por defecto usamos max-w-4xl (lectura comoda).
  wide?: boolean;
}

export function CaseShell({
  currentStep,
  completedSteps,
  children,
  wide = false,
}: CaseShellProps) {
  const containerWidth = wide ? "max-w-6xl" : "max-w-4xl";
  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar glass */}
      <header className="sticky top-0 z-50 glass">
        <div className={`mx-auto ${containerWidth} px-4 md:px-12 h-14 flex items-center justify-between gap-3`}>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-strong bg-paper/80 hover:bg-paper text-sm font-medium text-ink transition-colors"
          >
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
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Volver</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" />
            <span className="font-serif text-base font-medium tracking-tight">
              Clariza
            </span>
          </div>

          <span className="text-xs text-ink-3 hidden md:block">
            Paso {currentStep} de 3
          </span>
          <span className="md:hidden w-15" aria-hidden />
        </div>
      </header>

      {/* Stepper visible */}
      <div className="sticky top-14 z-40">
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* Contenido del paso */}
      <div className={`flex-1 mx-auto ${containerWidth} w-full px-4 md:px-12 py-8 md:py-12`}>
        {children}
      </div>
    </div>
  );
}
