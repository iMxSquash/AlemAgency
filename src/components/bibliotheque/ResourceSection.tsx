import type { Resource } from "@/types/bibliotheque";
import Link from "next/link";
import { ResourceCard } from "./ResourceCard";

interface Props {
  title: string;
  resources: Resource[];
  viewAllHref?: string;
  count?: number;
}

export function ResourceSection({ title, resources, viewAllHref, count }: Props) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm text-blue-600 hover:underline">
            Voir tout →
          </Link>
        )}
        {count !== undefined && <span className="text-sm text-gray-500">{count} éléments</span>}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {resources.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </section>
  );
}
