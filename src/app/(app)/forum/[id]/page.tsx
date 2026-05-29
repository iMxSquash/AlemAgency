import { ThreadDetail } from "@/components/forum/ThreadDetail";
import forumData from "@/lib/data/forum.json";
import { createClient } from "@/lib/supabase/server";
import type { ForumThread } from "@/types";
import { notFound, redirect } from "next/navigation";
import { getDbThread, getThreadReplies } from "../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ThreadPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const mockThread = (forumData as ForumThread[]).find((t) => t.id === id);

  let thread: ForumThread | null = mockThread ?? null;

  if (!thread) {
    const { data } = await getDbThread(id);
    thread = data;
  }

  if (!thread) notFound();

  const { data: dbReplies } = await getThreadReplies(id);

  return <ThreadDetail thread={thread} dbReplies={dbReplies ?? []} userEmail={user.email ?? ""} />;
}
