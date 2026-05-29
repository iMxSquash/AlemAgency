import type { Metadata } from "next";
import Image from "next/image";
import { signIn } from "./actions";

export const metadata: Metadata = {
  title: "Connexion | Zenko",
};

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <>
      <style>{`
        .auth-input:focus {
          border-color: var(--color-brand) !important;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 18%, transparent);
          outline: none;
        }
        .auth-btn:hover { opacity: 0.88; }
        .auth-btn:active { opacity: 0.75; transform: scale(0.99); }
      `}</style>

      <main className="flex min-h-screen">
        {/* ── Panneau gauche — branding ── */}
        <div
          className="relative hidden lg:flex lg:w-[52%] flex-col justify-between p-14 overflow-hidden"
          style={{ backgroundColor: "var(--color-background)" }}
        >
          {/* Grandes formes décoratives en teintes pastel */}
          <div
            className="absolute -top-20 -right-20 w-[380px] h-[380px] rounded-full"
            style={{ backgroundColor: "var(--color-bleu-25)", opacity: 0.9 }}
          />
          <div
            className="absolute bottom-10 -left-16 w-72 h-72 rounded-full"
            style={{ backgroundColor: "var(--color-vert-25)", opacity: 0.85 }}
          />
          <div
            className="absolute bottom-1/3 right-8 w-40 h-40 rounded-full"
            style={{ backgroundColor: "var(--color-rose-25)", opacity: 0.8 }}
          />
          {/* Petit carré accent */}
          <div
            className="absolute top-1/2 left-16 w-10 h-10 rounded-xl rotate-12"
            style={{ backgroundColor: "var(--color-brand)", opacity: 0.25 }}
          />
          <div
            className="absolute top-1/3 right-24 w-6 h-6 rounded-full"
            style={{ backgroundColor: "var(--color-brand-orange)", opacity: 0.4 }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <Image src="/logo.svg" alt="Zenko" width={160} height={47} priority />
          </div>

          {/* Texte central */}
          <div className="relative z-10 space-y-5">
            <div
              className="w-12 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-brand)" }}
            />
            <h2
              className="leading-[1.1]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display-md)",
                letterSpacing: "var(--tracking-display)",
                color: "var(--color-text-primary)",
                fontWeight: 700,
              }}
            >
              Bienvenue
              <br />
              <span style={{ color: "var(--color-brand)" }}>de retour.</span>
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-body-lg)",
                maxWidth: "26rem",
              }}
            >
              Connectez-vous pour accéder à votre espace et retrouver vos ressources.
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-brand)" }}
            />
            <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-body-sm)" }}>
              © 2025 Zenko
            </span>
          </div>
        </div>

        {/* ── Panneau droit — formulaire ── */}
        <div
          className="flex flex-1 flex-col items-center justify-center px-6 py-16 lg:px-16"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          {/* Logo mobile */}
          <div className="lg:hidden mb-10 self-start w-full max-w-sm mx-auto">
            <Image src="/logo.svg" alt="Zenko" width={120} height={35} />
          </div>

          <div className="w-full max-w-sm space-y-8">
            {/* En-tête */}
            <div className="space-y-2">
              <h1
                className="font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h3)",
                  color: "var(--color-text-primary)",
                }}
              >
                Connexion
              </h1>
              <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}>
                Entrez vos identifiants pour accéder à votre compte.
              </p>
            </div>

            {/* Erreur */}
            {error && (
              <div
                className="flex items-start gap-3 px-4 py-3"
                style={{
                  backgroundColor: "var(--color-specialist-bg)",
                  borderRadius: "var(--radius-card)",
                }}
              >
                <span className="text-sm mt-px">⚠️</span>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-specialist)" }}>
                  {error}
                </p>
              </div>
            )}

            {/* Formulaire */}
            <form action={signIn} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "var(--text-label)",
                    fontWeight: 600,
                    letterSpacing: "var(--tracking-label)",
                    textTransform: "uppercase",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  className="auth-input w-full transition-all"
                  style={{
                    backgroundColor: "var(--color-background)",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: "var(--radius-card)",
                    padding: "0.8rem 1rem",
                    fontSize: "var(--text-body-sm)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: "var(--text-label)",
                    fontWeight: 600,
                    letterSpacing: "var(--tracking-label)",
                    textTransform: "uppercase",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="auth-input w-full transition-all"
                  style={{
                    backgroundColor: "var(--color-background)",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: "var(--radius-card)",
                    padding: "0.8rem 1rem",
                    fontSize: "var(--text-body-sm)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              <button
                type="submit"
                className="auth-btn w-full font-semibold transition-all"
                style={{
                  backgroundColor: "var(--color-brand)",
                  color: "#fff",
                  borderRadius: "var(--radius-full)",
                  padding: "0.9rem 1.5rem",
                  fontSize: "var(--text-button)",
                  fontFamily: "var(--font-display)",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
              >
                Se connecter →
              </button>
            </form>

            {/* Lien signup */}
            <p
              className="text-center"
              style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)" }}
            >
              Pas encore de compte ?{" "}
              <a
                href="/signup"
                className="font-semibold hover:underline"
                style={{ color: "var(--color-brand)" }}
              >
                S&apos;inscrire
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
