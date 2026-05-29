import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Forum } from "@/components/forum/Forum";
import { getThreads } from "./actions";

export default async function ForumPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: threads } = await getThreads();

  return <Forum threads={threads ?? []} />;
}
