import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Resource } from "@/types";
import resourcesData from "@/lib/data/resources.json";
import categoriesData from "@/lib/data/categories.json";

const resources = resourcesData as Resource[];

export default async function EnCoursPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: progressRows } = await supabase
    .from("reading_progress")
    .select("resource_slug")
    .eq("user_id", user.id)
    .is("completed_at", null)
    .order("started_at", { ascending: false });

  const inProgressResources = (progressRows ?? [])
    .map((r) => resources.find((res) => res.slug === r.resource_slug))
    .filter((r): r is Resource => r !== undefined);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">En cours de lecture</h1>

      {inProgressResources.length === 0 ? (
        <p className="text-gray-500">
          Aucune fiche en cours.{" "}
          <Link href="/bibliotheque" className="underline hover:text-gray-700">
            Parcourir la bibliothèque
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {inProgressResources.map((resource) => {
            const category = categoriesData.find((c) => c.slug === resource.category);
            return (
              <li key={resource.slug}>
                <Link
                  href={`/bibliotheque/${resource.slug}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">{resource.title}</p>
                    <p className="mt-0.5 truncate text-sm text-gray-500">{resource.description}</p>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-2">
                    {category && (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${category.color}`}>
                        {category.label}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{resource.estimatedReadTime} min</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
