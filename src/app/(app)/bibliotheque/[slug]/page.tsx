import categoriesData from "@/lib/data/categories.json";
import resourcesData from "@/lib/data/resources.json";
import { createClient } from "@/lib/supabase/server";
import type { Resource } from "@/types";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const resources = resourcesData as Resource[];
import { SaveButton } from "./SaveButton";
import { ScrollTracker } from "./ScrollTracker";
import { Section } from "./Section";
import { saveResource, unsaveResource } from "./actions";

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const resource = resources.find((r) => r.slug === slug);
  if (!resource) notFound();

  const [category, savedRow, progressRow] = await Promise.all([
    Promise.resolve(categoriesData.find((c) => c.slug === resource.category)),
    supabase
      .from("saved_resources")
      .select("id")
      .eq("user_id", user.id)
      .eq("resource_slug", slug)
      .maybeSingle(),
    supabase
      .from("reading_progress")
      .select("completed_at")
      .eq("user_id", user.id)
      .eq("resource_slug", slug)
      .maybeSingle(),
  ]);

  if (!progressRow.data) {
    await supabase.from("reading_progress").insert({ user_id: user.id, resource_slug: slug });
  }

  const isSaved = !!savedRow.data;
  const isCompleted = !!progressRow.data?.completed_at;
  const boundToggleSave = isSaved ? unsaveResource.bind(null, slug) : saveResource.bind(null, slug);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <Link
          href="/bibliotheque"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Bibliothèque
        </Link>

        <div className="mb-3 flex items-center gap-3">
          {category && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${category.color}`}>
              {category.label}
            </span>
          )}
          <span className="text-xs capitalize text-gray-500">{resource.type}</span>
          <span className="text-xs text-gray-500">{resource.estimatedReadTime} min de lecture</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{resource.title}</h1>
            <p className="mt-2 text-gray-500">{resource.description}</p>
          </div>
          <form action={boundToggleSave} className="shrink-0">
            <SaveButton isSaved={isSaved} />
          </form>
        </div>
      </div>

      <div className="space-y-6">
        {resource.sections.map((section, i) => (
          <Section key={`${section.type}-${i}`} section={section} />
        ))}
      </div>

      <ScrollTracker slug={slug} isCompleted={isCompleted} />
    </main>
  );
}
