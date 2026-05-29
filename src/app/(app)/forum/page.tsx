import { Forum } from "@/components/forum/Forum";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getThreads } from "./actions";

export default async function ForumPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: threads } = await getThreads();

  return <Forum threads={threads ?? []} userEmail={user.email ?? ""} />;
}
