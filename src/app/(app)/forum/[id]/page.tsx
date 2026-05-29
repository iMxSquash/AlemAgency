import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThreadDetail } from "@/components/forum/ThreadDetail";
import { getThreadReplies } from "../actions";
import forumData from "@/lib/data/forum.json";
import type { ForumThread } from "@/types";

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

  const thread = (forumData as ForumThread[]).find((t) => t.id === id);
  if (!thread) notFound();

  const { data: dbReplies } = await getThreadReplies(id);

  return (
    <ThreadDetail
      thread={thread}
      dbReplies={dbReplies ?? []}
      userEmail={user.email ?? ""}
    />
  );
}
