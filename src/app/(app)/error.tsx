"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-semibold">Une erreur est survenue</h2>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
      >
        Réessayer
      </button>
    </div>
  );
}
