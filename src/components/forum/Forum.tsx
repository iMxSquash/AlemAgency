"use client";

import { createThread } from "@/app/(app)/forum/actions";
import { cn } from "@/lib/utils";
import type { ForumThread, ForumUserRole, ResourceCategory } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const ROLE_LABELS: Record<ForumUserRole, string> = {
  parent: "Parent",
  prof: "Enseignant-e",
  expert: "Expert-e",
};

const ROLE_CAPSULE_BG: Record<ForumUserRole, string> = {
  parent: "bg-rose-25",
  prof: "bg-vert-25",
  expert: "bg-bleu-25",
};

const CATEGORY_CAPSULE_BG: Record<ResourceCategory, string> = {
  TSA: "bg-orange-25",
  TDAH: "bg-rose-25",
  DYS: "bg-bleu-25",
  TDI: "bg-vert-25",
};

const CATEGORIES: ResourceCategory[] = ["TSA", "DYS", "TDAH", "TDI"];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function Capsule({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-capsule px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.06em] text-text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}

interface ForumProps {
  threads: ForumThread[];
  userEmail: string;
}

export function Forum({ threads, userEmail }: ForumProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("TSA");
  const [authorName, setAuthorName] = useState(userEmail.split("@")[0]);
  const [authorRole, setAuthorRole] = useState<ForumUserRole>("parent");
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = threads
    .filter((t) => activeCategory === "all" || t.category === activeCategory)
    .filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  const pinned = filtered.filter((t) => t.isPinned);
  const regular = filtered.filter((t) => !t.isPinned);

  function handleCancel() {
    setShowForm(false);
    setTitle("");
    setContent("");
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    startTransition(async () => {
      const result = await createThread({ title, content, category, authorName, authorRole });
      if (result.error) {
        setFormError(result.error);
        return;
      }
      handleCancel();
      router.push(`/forum/${result.data?.id}`);
    });
  }

  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold leading-[36px] tracking-[-0.003em] text-text-primary">
          Forum
        </h1>
        <p className="text-[16px] font-normal leading-6 text-text-secondary">
          Des conversations entre parents / enseignants / professionnels
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <div className="flex flex-1 items-center gap-[10px] rounded-[14px] border border-border-default bg-surface px-4 py-3">
            <span className="text-[16px] font-medium text-text-primary">⌕</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une discussion..."
              className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>

          {/* Category filter capsules — scroll horizontal sur mobile, inline sur desktop */}
          <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 md:mx-0 md:overflow-visible md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-[10px] pb-0.5 md:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(activeCategory === cat ? "all" : cat)}
                  className={cn(
                    "flex h-10 shrink-0 items-center justify-center rounded-capsule border px-3 text-[10px] font-semibold uppercase tracking-[0.06em] transition-colors",
                    activeCategory === cat
                      ? "border-brand-100 bg-bleu-25 text-brand"
                      : "border-border bg-neutral-100 text-text-secondary hover:border-border-default"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-fit rounded-full bg-brand-100 px-6 py-4 font-display text-[16px] font-semibold leading-4 text-[#f4f4f7] transition-opacity hover:opacity-90"
        >
          Ouvrir une conversation
        </button>
      </div>

      {/* Thread list */}
      <div className="flex flex-col gap-3">
        {[...pinned, ...regular].map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-[14px] text-text-muted">
            Aucune discussion pour l'instant.
          </p>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-card bg-surface p-6 shadow-xl"
          >
            <h2 className="mb-5 text-[22px] font-semibold text-text-primary">
              Ouvrir une conversation
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="thread-title"
                  className="mb-1 block text-[12px] font-medium text-text-secondary"
                >
                  Titre
                </label>
                <input
                  id="thread-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ex : Comment gérer les crises sensorielles à l'école ?"
                  className="w-full rounded-[8px] border border-border-default bg-background px-3 py-2 text-[14px] text-text-primary outline-none focus:border-brand"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label
                    htmlFor="thread-category"
                    className="mb-1 block text-[12px] font-medium text-text-secondary"
                  >
                    Catégorie
                  </label>
                  <select
                    id="thread-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                    className="w-full rounded-[8px] border border-border-default bg-background px-3 py-2 text-[14px] text-text-primary outline-none focus:border-brand"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="thread-role"
                    className="mb-1 block text-[12px] font-medium text-text-secondary"
                  >
                    Votre rôle
                  </label>
                  <select
                    id="thread-role"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value as ForumUserRole)}
                    className="w-full rounded-[8px] border border-border-default bg-background px-3 py-2 text-[14px] text-text-primary outline-none focus:border-brand"
                  >
                    <option value="parent">Parent</option>
                    <option value="prof">Enseignant-e</option>
                    <option value="expert">Expert-e</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="thread-author"
                  className="mb-1 block text-[12px] font-medium text-text-secondary"
                >
                  Nom affiché
                </label>
                <input
                  id="thread-author"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                  className="w-full rounded-[8px] border border-border-default bg-background px-3 py-2 text-[14px] text-text-primary outline-none focus:border-brand"
                />
              </div>

              <div>
                <label
                  htmlFor="thread-content"
                  className="mb-1 block text-[12px] font-medium text-text-secondary"
                >
                  Message
                </label>
                <textarea
                  id="thread-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={5}
                  placeholder="Décrivez votre situation ou posez votre question..."
                  className="w-full resize-none rounded-[8px] border border-border-default bg-background px-3 py-2 text-[14px] text-text-primary outline-none focus:border-brand"
                />
              </div>

              {formError && <p className="text-[14px] text-danger">{formError}</p>}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-[8px] px-4 py-2 text-[14px] font-medium text-text-secondary hover:bg-background"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-brand-100 px-5 py-2 font-display text-[16px] font-semibold text-[#f4f4f7] transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {isPending ? "Publication…" : "Publier"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ThreadCard({ thread }: { thread: ForumThread }) {
  return (
    <Link
      href={`/forum/${thread.id}`}
      className="flex flex-col gap-[10px] rounded-[14px] border border-border-default bg-surface p-4 transition-shadow hover:shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-[10px]">
        <Capsule className={CATEGORY_CAPSULE_BG[thread.category]}>{thread.category}</Capsule>
        <Capsule className={ROLE_CAPSULE_BG[thread.author.role]}>
          {ROLE_LABELS[thread.author.role]}
        </Capsule>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[18px] font-semibold leading-[26px] text-text-primary">{thread.title}</p>
        <p className="text-[14px] font-normal leading-5 text-text-muted">
          Par {thread.author.name} · {formatDate(thread.createdAt)} · {thread.replies.length}{" "}
          réponse{thread.replies.length !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
