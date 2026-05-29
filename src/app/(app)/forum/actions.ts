"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ForumReply, ForumThread, ForumUserRole, ResourceCategory } from "@/types";
import forumData from "@/lib/data/forum.json";

export async function getThreads(): Promise<{ data: ForumThread[] | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("forum_threads")
    .select("id, user_id, title, content, category, author_name, author_role, created_at")
    .order("created_at", { ascending: false });

  if (error) return { data: null, error: error.message };

  const dbThreads: ForumThread[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category as ResourceCategory,
    author: { id: row.user_id, name: row.author_name, role: row.author_role as ForumUserRole },
    replies: [],
    createdAt: row.created_at,
    isPinned: false,
  }));

  return { data: [...(forumData as ForumThread[]), ...dbThreads], error: null };
}

export async function getDbThread(
  id: string,
): Promise<{ data: ForumThread | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("forum_threads")
    .select("id, user_id, title, content, category, author_name, author_role, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return { data: null, error: error?.message ?? "Not found" };

  return {
    data: {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category as ResourceCategory,
      author: { id: data.user_id, name: data.author_name, role: data.author_role as ForumUserRole },
      replies: [],
      createdAt: data.created_at,
      isPinned: false,
    },
    error: null,
  };
}

export async function getThreadReplies(
  threadId: string,
): Promise<{ data: ForumReply[] | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("forum_replies")
    .select("id, user_id, author_name, author_role, content, created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) return { data: null, error: error.message };

  const replies: ForumReply[] = (data ?? []).map((row) => ({
    id: row.id,
    author: { id: row.user_id, name: row.author_name, role: row.author_role as ForumUserRole },
    content: row.content,
    createdAt: row.created_at,
  }));

  return { data: replies, error: null };
}

export async function addReply(
  threadId: string,
  payload: { content: string; authorName: string; authorRole: ForumUserRole },
): Promise<{ data: null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { error } = await supabase.from("forum_replies").insert({
    thread_id: threadId,
    user_id: user.id,
    author_name: payload.authorName,
    author_role: payload.authorRole,
    content: payload.content,
  });

  if (error) return { data: null, error: error.message };

  revalidatePath(`/forum/${threadId}`);
  return { data: null, error: null };
}

export async function createThread(payload: {
  title: string;
  content: string;
  category: ResourceCategory;
  authorName: string;
  authorRole: ForumUserRole;
}): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("forum_threads")
    .insert({
      user_id: user.id,
      title: payload.title,
      content: payload.content,
      category: payload.category,
      author_name: payload.authorName,
      author_role: payload.authorRole,
    })
    .select("id")
    .single();

  if (error || !data) return { data: null, error: error?.message ?? "Insert failed" };

  revalidatePath("/forum");
  return { data: { id: data.id }, error: null };
}
