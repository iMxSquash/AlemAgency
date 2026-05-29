"use client";

import { useFormStatus } from "react-dom";

export function SaveButton({ isSaved }: { isSaved: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || isSaved}
      className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 bg-gray-900 text-white hover:bg-gray-700 disabled:bg-gray-900"
    >
      {pending ? "Sauvegarde…" : isSaved ? "Sauvegardée ✓" : "Sauvegarder"}
    </button>
  );
}
