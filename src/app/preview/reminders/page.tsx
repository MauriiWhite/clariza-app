"use client";

import React from "react";
import { ReminderForm } from "@/modules/reminders/components/ReminderForm";

export default function RemindersPreviewPage() {
  return (
    <div className="p-8 max-w-lg mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-4">Preview: Activar Recordatorios (Magic Link)</h1>
      <ReminderForm />
    </div>
  );
}
