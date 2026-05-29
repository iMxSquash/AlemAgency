"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ForumReply, ForumThread, ForumUserRole, ResourceCategory } from "@/types";
import { addReply } from "@/app/(app)/forum/actions";

const ROLE_LABELS: Record<ForumUserRole, string> = {
  parent: "Parent",
  prof: "Enseignant·e",
  expert: "Expert·e",
};

const ROLE_COLORS: Record<ForumUserRole, string> = {
  parent: "bg-blue-100 text-blue-800",
  prof: "bg-green-100 text-green-800",
  expert: "bg-purple-100 text-purple-800",
};

const CATEGORY_COLORS: Record<ResourceCategory, string> = {
  TDAH: "bg-orange-100 text-orange-700",
  TSA: "bg-teal-100 text-teal-700",
  DYS: "bg-pink-100 text-pink-700",
  TDI: "bg-indigo-100 text-indigo-700",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function RoleBadge({ role }: { role: ForumUserRole }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", ROLE_COLORS[role])}>
      {ROLE_LABELS[role]}
    </span>
  );
}

function ReplyCard({ reply }: { reply: ForumReply }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-800">{reply.author.name}</span>
        <RoleBadge role={reply.author.role} />
        <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
      </div>
      <p className="text-sm leading-relaxed text-gray-700">{reply.content}</p>
    </div>
  );
}

interface ReplyFormProps {
  threadId: string;
  userEmail: string;
}

function ReplyForm({ threadId, userEmail }: ReplyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState(userEmail.split("@")[0]);
  const [authorRole, setAuthorRole] = useState<ForumUserRole>("parent");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setError(null);
    startTransition(async () => {
      const result = await addReply(threadId, { content, authorName, authorRole });
      if (result.error) {
        setError(result.error);
        return;
      }
      setContent("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-5">
      <p className="font-medium text-gray-900">Ajouter une réponse</p>

      <div className="flex gap-3">
        <div className="flex-1">
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
          <label className="mb-1 block text-xs font-medium text-gray-500">Rôle</label>
          <select
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value as ForumUserRole)}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          >
            <option value="parent">Parent</option>
            <option value="prof">Enseignant·e</option>
            <option value="expert">Expert·e</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Message</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          placeholder="Partagez votre expérience ou conseil..."
          className="w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
      >
        {isPending ? "Envoi…" : "Répondre"}
      </button>
    </form>
  );
}

interface ThreadDetailProps {
  thread: ForumThread;
  dbReplies: ForumReply[];
  userEmail: string;
}

export function ThreadDetail({ thread, dbReplies, userEmail }: ThreadDetailProps) {
  const allReplies = [...thread.replies, ...dbReplies].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/forum" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700">
        ← Retour au forum
      </Link>

      <div className="mb-8 rounded-lg border bg-white px-6 py-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              CATEGORY_COLORS[thread.category],
            )}
          >
            {thread.category}
          </span>
          <RoleBadge role={thread.author.role} />
        </div>
        <h1 className="text-xl font-bold text-gray-900">{thread.title}</h1>
        <p className="mt-1 text-xs text-gray-400">
          Par {thread.author.name} · {formatDate(thread.createdAt)}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-gray-700">{thread.content}</p>
      </div>

      <div className="mb-6 space-y-4">
        {allReplies.length > 0 && (
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {allReplies.length} réponse{allReplies.length !== 1 ? "s" : ""}
          </p>
        )}
        {allReplies.map((reply) => (
          <ReplyCard key={reply.id} reply={reply} />
        ))}
        {allReplies.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">
            Aucune réponse pour l'instant — soyez le premier·e à contribuer.
          </p>
        )}
      </div>

      <ReplyForm threadId={thread.id} userEmail={userEmail} />
    </div>
  );
}
