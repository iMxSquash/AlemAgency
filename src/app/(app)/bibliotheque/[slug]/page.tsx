import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ContentSection, Resource } from "@/types";
import resourcesData from "@/lib/data/resources.json";
import categoriesData from "@/lib/data/categories.json";
import { saveResource, markAsCompleted } from "./actions";
import { SaveButton } from "./SaveButton";
import { CompleteButton } from "./CompleteButton";

const resources = resourcesData as Resource[];

function Section({ section }: { section: ContentSection }) {
  switch (section.type) {
    case "text":
      return <p className="leading-relaxed text-gray-700">{section.content}</p>;

    case "list":
      return (
        <div>
          {section.title && (
            <h3 className="mb-2 font-semibold text-gray-900">{section.title}</h3>
          )}
          <ul className="list-disc space-y-1 pl-5">
            {section.items.map((item, i) => (
              <li key={i} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "steps":
      return (
        <div>
          {section.title && (
            <h3 className="mb-2 font-semibold text-gray-900">{section.title}</h3>
          )}
          <ol className="list-decimal space-y-1 pl-5">
            {section.items.map((item, i) => (
              <li key={i} className="text-gray-700">
                {item}
              </li>
            ))}
          </ol>
        </div>
      );

    case "tip":
      return (
        <div className="rounded-r border-l-4 border-blue-400 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">{section.content}</p>
        </div>
      );

    case "warning":
      return (
        <div className="rounded-r border-l-4 border-amber-400 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">{section.content}</p>
        </div>
      );
  }
}

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
    await supabase
      .from("reading_progress")
      .insert({ user_id: user.id, resource_slug: slug });
  }

  const isSaved = !!savedRow.data;
  const isCompleted = !!progressRow.data?.completed_at;
  const boundSaveResource = saveResource.bind(null, slug);
  const boundMarkAsCompleted = markAsCompleted.bind(null, slug);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
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
          <form action={boundSaveResource} className="shrink-0">
            <SaveButton isSaved={isSaved} />
          </form>
        </div>
      </div>

      <div className="space-y-6">
        {resource.sections.map((section, i) => (
          <Section key={i} section={section} />
        ))}
      </div>

      <div className="mt-10 flex justify-end border-t pt-6">
        <form action={boundMarkAsCompleted}>
          <CompleteButton isCompleted={isCompleted} />
        </form>
      </div>
    </main>
  );
}
