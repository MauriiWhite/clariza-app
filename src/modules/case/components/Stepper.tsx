// Indicador visual de pasos del wizard.
// Sticky abajo del top bar — siempre visible para que el ciudadano sepa
// donde esta y cuanto le falta.

"use client";

interface StepperProps {
  steps: { id: number; label: string }[];
  currentStep: number;
  completedSteps: number[];
}

export function Stepper({ steps, currentStep, completedSteps }: StepperProps) {
  return (
    <nav
      aria-label="Progreso del caso"
      className="border-b border-border bg-paper/60 backdrop-blur-md"
    >
      <ol className="mx-auto max-w-4xl px-6 md:px-12 py-4 flex items-center gap-3 overflow-x-auto">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isComplete = completedSteps.includes(step.id);
          const isLast = idx === steps.length - 1;

          return (
            <li key={step.id} className="flex items-center gap-3 shrink-0">
              <div
                className={`flex items-center gap-2 ${
                  isActive ? "" : isComplete ? "" : "opacity-60"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${
                    isComplete
                      ? "bg-success text-white"
                      : isActive
                        ? "bg-clay text-white"
                        : "bg-cream border border-border text-ink-3"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isComplete ? "✓" : step.id}
                </span>
                <span
                  className={`text-sm whitespace-nowrap ${
                    isActive
                      ? "font-semibold text-ink"
                      : isComplete
                        ? "font-medium text-ink-2"
                        : "font-medium text-ink-3"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <span
                  className={`inline-block w-6 h-px ${
                    isComplete ? "bg-success" : "bg-border"
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
