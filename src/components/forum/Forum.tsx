"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ForumThread, ForumUserRole, ResourceCategory } from "@/types";

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
}

export function Forum({ threads }: ForumProps) {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "all">("all");

  const filtered =
    activeCategory === "all" ? threads : threads.filter((t) => t.category === activeCategory);

  const pinned = filtered.filter((t) => t.isPinned);
  const regular = filtered.filter((t) => !t.isPinned);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Forum communautaire</h1>
        <p className="mt-1 text-sm text-gray-500">
          Échanges entre parents, enseignant·e·s et expert·e·s autour de la neurodivergence.
        </p>
      </div>

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
