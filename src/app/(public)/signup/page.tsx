import type { Metadata } from "next";
import Image from "next/image";
import { signUp } from "./actions";

export const metadata: Metadata = {
  title: "Inscription | Zenko",
};

interface Props {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function SignupPage({ searchParams }: Props) {
  const { error, success } = await searchParams;

  if (success) {
    return (
      <main
        className="flex min-h-screen items-center justify-center p-6"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div
          className="w-full max-w-sm space-y-6 text-center p-10"
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-card-lg)",
            border: "1.5px solid var(--color-border)",
          }}
        >
          <div
            className="mx-auto flex items-center justify-center w-16 h-16 text-3xl rounded-full"
            style={{ backgroundColor: "var(--color-bleu-25)" }}
          >
            ✉️
          </div>
          <div className="space-y-2">
            <h1
              className="font-bold"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h3)",
                color: "var(--color-text-primary)",
              }}
            >
              Vérifiez votre email
            </h1>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}>
              Un lien de confirmation vous a été envoyé. Cliquez dessus pour activer votre compte.
            </p>
          </div>
          <a
            href="/login"
            className="inline-block font-semibold hover:underline"
            style={{ fontSize: "var(--text-body-sm)", color: "var(--color-brand)" }}
          >
            ← Retour à la connexion
          </a>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        .auth-input-green:focus {
          border-color: var(--color-brand-green) !important;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-green) 18%, transparent);
          outline: none;
        }
        .auth-btn-green:hover { opacity: 0.88; }
        .auth-btn-green:active { opacity: 0.75; transform: scale(0.99); }
      `}</style>

      <main className="flex min-h-screen">
        {/* ── Panneau gauche — branding ── */}
        <div
          className="relative hidden lg:flex lg:w-[52%] flex-col justify-between p-14 overflow-hidden"
          style={{ backgroundColor: "var(--color-background)" }}
        >
          {/* Formes décoratives pastel */}
          <div
            className="absolute -top-16 -left-16 w-96 h-96 rounded-full"
            style={{ backgroundColor: "var(--color-vert-25)", opacity: 0.9 }}
          />
          <div
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
            style={{ backgroundColor: "var(--color-bleu-25)", opacity: 0.8 }}
          />
          <div
            className="absolute top-1/2 right-20 w-48 h-48 rounded-full"
            style={{ backgroundColor: "var(--color-rose-25)", opacity: 0.75 }}
          />
          <div
            className="absolute bottom-1/4 left-20 w-8 h-8 rounded-xl -rotate-12"
            style={{ backgroundColor: "var(--color-brand-green)", opacity: 0.3 }}
          />
          <div
            className="absolute top-1/4 right-32 w-5 h-5 rounded-full"
            style={{ backgroundColor: "var(--color-brand-orange)", opacity: 0.45 }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <Image src="/logo.svg" alt="Zenko" width={160} height={47} priority />
          </div>

          {/* Texte central */}
          <div className="relative z-10 space-y-5">
            <div
              className="w-12 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-brand-green)" }}
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
              Rejoignez
              <br />
              <span style={{ color: "var(--color-brand-green)" }}>l&apos;aventure.</span>
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-body-lg)",
                maxWidth: "26rem",
              }}
            >
              Créez votre compte et accédez à toutes vos ressources en quelques secondes.
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-brand-green)" }}
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

          <div className="w-full max-w-sm space-y-7">
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
                Créer un compte
              </h1>
              <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}>
                Remplissez le formulaire pour rejoindre Zenko.
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
            <form action={signUp} className="space-y-5">
              {[
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "vous@exemple.com",
                  autoComplete: "email",
                },
                {
                  id: "password",
                  label: "Mot de passe",
                  type: "password",
                  placeholder: "••••••••",
                  autoComplete: "new-password",
                  minLength: 8,
                },
                {
                  id: "confirmation",
                  label: "Confirmer le mot de passe",
                  type: "password",
                  placeholder: "••••••••",
                  autoComplete: "new-password",
                  minLength: 8,
                },
              ].map(({ id, label, type, placeholder, autoComplete, minLength }) => (
                <div key={id} className="space-y-2">
                  <label
                    htmlFor={id}
                    style={{
                      display: "block",
                      fontSize: "var(--text-label)",
                      fontWeight: 600,
                      letterSpacing: "var(--tracking-label)",
                      textTransform: "uppercase",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    required
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    minLength={minLength}
                    className="auth-input-green w-full transition-all"
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
              ))}

              <button
                type="submit"
                className="auth-btn-green w-full font-semibold transition-all"
                style={{
                  backgroundColor: "var(--color-brand-green)",
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
                Créer mon compte →
              </button>
            </form>

            {/* Lien login */}
            <p
              className="text-center"
              style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)" }}
            >
              Déjà un compte ?{" "}
              <a
                href="/login"
                className="font-semibold hover:underline"
                style={{ color: "var(--color-brand)" }}
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
