"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ForumThread, ForumUserRole, ResourceCategory } from "@/types";
import { createThread } from "@/app/(app)/forum/actions";

const ROLE_COLORS: Record<ForumUserRole, string> = {
  parent: "bg-blue-100 text-blue-800",
  prof: "bg-green-100 text-green-800",
  expert: "bg-purple-100 text-purple-800",
};

const ROLE_LABELS: Record<ForumUserRole, string> = {
  parent: "Parent",
  prof: "Enseignant·e",
  expert: "Expert·e",
};

const CATEGORY_COLORS: Record<ResourceCategory, string> = {
  TDAH: "bg-orange-100 text-orange-700",
  TSA: "bg-teal-100 text-teal-700",
  DYS: "bg-pink-100 text-pink-700",
  TDI: "bg-indigo-100 text-indigo-700",
};

const CATEGORIES: ResourceCategory[] = ["TDAH", "TSA", "DYS", "TDI"];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
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
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("TDAH");
  const [authorName, setAuthorName] = useState(userEmail.split("@")[0]);
  const [authorRole, setAuthorRole] = useState<ForumUserRole>("parent");
  const [formError, setFormError] = useState<string | null>(null);

  const filtered =
    activeCategory === "all" ? threads : threads.filter((t) => t.category === activeCategory);

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
      router.push(`/forum/${result.data!.id}`);
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forum communautaire</h1>
          <p className="mt-1 text-sm text-gray-500">
            Échanges entre parents, enseignant·e·s et expert·e·s autour de la neurodivergence.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="shrink-0 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          + Nouvelle discussion
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 className="mb-5 text-lg font-semibold text-gray-900">Ouvrir une conversation</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ex : Comment gérer les crises sensorielles à l'école ?"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">Votre rôle</label>
                  <select
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value as ForumUserRole)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  >
                    <option value="parent">Parent</option>
                    <option value="prof">Enseignant·e</option>
                    <option value="expert">Expert·e</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Nom affiché</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Message</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={5}
                  placeholder="Décrivez votre situation ou posez votre question..."
                  className="w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                {isPending ? "Publication…" : "Publier"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium transition-colors",
            activeCategory === "all"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          Tous
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium transition-colors",
              activeCategory === cat
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {pinned.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} pinned />
        ))}
        {regular.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-400">Aucun fil dans cette catégorie.</p>
        )}
      </div>
    </div>
  );
}

function ThreadCard({ thread, pinned }: { thread: ForumThread; pinned?: boolean }) {
  return (
    <Link
      href={`/forum/${thread.id}`}
      className={cn(
        "block rounded-lg border bg-white px-5 py-4 transition-shadow hover:shadow-md",
        pinned && "border-orange-200 bg-orange-50/30",
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {pinned && (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
            Épinglé
          </span>
        )}
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            CATEGORY_COLORS[thread.category],
          )}
        >
          {thread.category}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            ROLE_COLORS[thread.author.role],
          )}
        >
          {ROLE_LABELS[thread.author.role]}
        </span>
      </div>
      <p className="font-medium text-gray-900">{thread.title}</p>
      <p className="mt-1 text-xs text-gray-400">
        Par {thread.author.name} · {formatDate(thread.createdAt)} ·{" "}
        {thread.replies.length} réponse{thread.replies.length !== 1 ? "s" : ""}
      </p>
    </Link>
  );
}
