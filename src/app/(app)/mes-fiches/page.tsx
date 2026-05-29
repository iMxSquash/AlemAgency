import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Resource } from "@/types";
import resourcesData from "@/lib/data/resources.json";
import categoriesData from "@/lib/data/categories.json";
import { unsaveResource } from "./actions";

const resources = resourcesData as Resource[];

export default async function MesFichesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: savedRows } = await supabase
    .from("saved_resources")
    .select("resource_slug")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false });

  const savedResources = (savedRows ?? [])
    .map((r) => resources.find((res) => res.slug === r.resource_slug))
    .filter((r): r is Resource => r !== undefined);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Fiches sauvegardées</h1>

      {savedResources.length === 0 ? (
        <p className="text-gray-500">
          Aucune fiche sauvegardée.{" "}
          <Link href="/bibliotheque" className="underline hover:text-gray-700">
            Parcourir la bibliothèque
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {savedResources.map((resource) => {
            const category = categoriesData.find((c) => c.slug === resource.category);
            const boundUnsave = unsaveResource.bind(null, resource.slug);
            return (
              <li
                key={resource.slug}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white pr-3 transition-colors hover:bg-gray-50"
              >
                <Link
                  href={`/bibliotheque/${resource.slug}`}
                  className="flex min-w-0 flex-1 items-center justify-between px-4 py-3"
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
                <form action={boundUnsave}>
                  <button
                    type="submit"
                    className="shrink-0 rounded px-2 py-1 text-xs text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    aria-label={`Retirer ${resource.title} des sauvegardes`}
                  >
                    Retirer
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
