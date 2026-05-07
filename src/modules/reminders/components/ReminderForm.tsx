"use client";

import React, { useState } from "react";
import { sendMagicLink } from "../services/auth";

interface ReminderFormProps {
  onSuccess?: () => void;
}

export function ReminderForm({ onSuccess }: ReminderFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      // Usamos el origen actual para el redireccionamiento
      const redirectTo = `${window.location.origin}/auth/callback?next=/console`;
      await sendMagicLink(email, redirectTo);
      setStatus("success");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Ocurrió un error al enviar el enlace.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-cream border border-border p-6 rounded-md">
        <h3 className="font-serif text-[20px] text-ink mb-2">¡Revisa tu correo!</h3>
        <p className="text-ink-2">
          Te hemos enviado un enlace mágico a <strong>{email}</strong> para activar tus recordatorios.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-paper border border-border p-6 rounded-md shadow-sm">
      <h3 className="font-serif text-[20px] text-ink mb-4">Activar Recordatorios</h3>
      <p className="text-ink-2 text-sm mb-6">
        Ingresa tu correo electrónico y te enviaremos un enlace mágico para activar notificaciones sobre los plazos de tu reclamo.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
            placeholder="maria@ejemplo.com"
            disabled={status === "loading"}
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !email}
          className="w-full bg-clay hover:bg-clay-soft text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Enviando..." : "Enviar Enlace Mágico"}
        </button>
      </form>
    </div>
  );
}
