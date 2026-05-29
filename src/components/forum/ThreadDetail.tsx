"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ForumReply, ForumThread, ForumUserRole, ResourceCategory } from "@/types";
import { addReply } from "@/app/(app)/forum/actions";

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


function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function Capsule({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-capsule px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.06em] text-text-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}

function ReplyCard({ reply }: { reply: ForumReply }) {
  return (
    <div className="flex flex-col gap-[10px] rounded-[14px] border border-border bg-background p-4">
      <div className="flex flex-wrap items-center gap-[10px]">
        <span className="text-[14px] font-semibold leading-5 text-text-primary">
          {reply.author.name}
        </span>
        <Capsule className={ROLE_CAPSULE_BG[reply.author.role]}>
          {ROLE_LABELS[reply.author.role]}
        </Capsule>
        <span className="text-[12px] text-text-muted">{formatDate(reply.createdAt)}</span>
      </div>
      <p className="text-[14px] font-normal leading-5 text-text-secondary">{reply.content}</p>
    </div>
  );
}

function ReplyForm({ threadId, userEmail }: { threadId: string; userEmail: string }) {
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
      if (result.error) { setError(result.error); return; }
      setContent("");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-[14px] border border-border-default bg-surface p-4"
    >
      <p className="text-[18px] font-semibold leading-[26px] text-text-primary">
        Ajouter une réponse
      </p>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-[12px] font-medium text-text-secondary">
            Nom affiché
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="w-full rounded-[8px] border border-border-default bg-background px-3 py-2 text-[14px] text-text-primary outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-medium text-text-secondary">Rôle</label>
          <select
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value as ForumUserRole)}
            className="rounded-[8px] border border-border-default bg-background px-3 py-2 text-[14px] text-text-primary outline-none focus:border-brand"
          >
            <option value="parent">Parent</option>
            <option value="prof">Enseignant-e</option>
            <option value="expert">Expert-e</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[12px] font-medium text-text-secondary">Message</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          placeholder="Partagez votre expérience ou conseil..."
          className="w-full resize-none rounded-[8px] border border-border-default bg-background px-3 py-2 text-[14px] text-text-primary outline-none focus:border-brand"
        />
      </div>

      {error && <p className="text-[14px] text-danger">{error}</p>}

      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="w-fit rounded-full bg-brand-100 px-5 py-2 font-display text-[16px] font-semibold text-[#f4f4f7] transition-opacity hover:opacity-90 disabled:opacity-40"
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
    <div className="flex flex-col gap-8 px-4 py-8">
      <Link
        href="/forum"
        className="w-fit text-[14px] text-text-muted hover:text-text-secondary"
      >
        ← Retour au forum
      </Link>

      {/* Thread */}
      <div className="flex flex-col gap-[10px] rounded-[14px] border border-border-default bg-surface p-4">
        <div className="flex flex-wrap items-center gap-[10px]">
          <Capsule className={CATEGORY_CAPSULE_BG[thread.category]}>{thread.category}</Capsule>
          <Capsule className={ROLE_CAPSULE_BG[thread.author.role]}>
            {ROLE_LABELS[thread.author.role]}
          </Capsule>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold leading-[36px] tracking-[-0.003em] text-text-primary">
            {thread.title}
          </h1>
          <p className="text-[14px] font-normal leading-5 text-text-muted">
            {thread.author.name} · {formatDate(thread.createdAt)}
          </p>
        </div>
        <p className="text-[14px] font-normal leading-5 text-text-secondary">{thread.content}</p>
      </div>

      {/* Replies */}
      <div className="flex flex-col gap-3">
        {allReplies.length > 0 && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-muted">
            {allReplies.length} réponse{allReplies.length !== 1 ? "s" : ""}
          </p>
        )}
        {allReplies.map((reply) => (
          <ReplyCard key={reply.id} reply={reply} />
        ))}
        {allReplies.length === 0 && (
          <p className="py-6 text-center text-[14px] text-text-muted">
            Aucune réponse pour l'instant — soyez le premier·e à contribuer.
          </p>
        )}
      </div>

      <ReplyForm threadId={thread.id} userEmail={userEmail} />
    </div>
  );
}
