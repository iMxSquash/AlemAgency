"use client";

import { useFormStatus } from "react-dom";

export function CompleteButton({ isCompleted }: { isCompleted: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || isCompleted}
      className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 bg-green-700 text-white hover:bg-green-800 disabled:bg-green-700"
    >
      {pending ? "Enregistrement…" : isCompleted ? "Lu ✓" : "Marquer comme terminé"}
    </button>
  );
}
