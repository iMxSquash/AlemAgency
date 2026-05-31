import { BibliothequeClient } from "@/components/bibliotheque/BibliothequeClient";
import resourcesData from "@/lib/data/resources.json";
import type { Resource } from "@/types/index";

export const metadata = {
  title: "Bibliothèque — Zenko",
  description: "Fiches pratiques, scripts, vidéos pour enseignants.",
};

export default function BibliothequePage() {
  const resources = resourcesData as unknown as Resource[];

  //wire up Supabase
  // const supabase = createServerClient()
  // const { data: saved } = await supabase.from("saved_resources").select("resource_slug")
  // const { data: progress } = await supabase.from("reading_progress").select("resource_slug, completed_at")
  // const savedResourceSlugs = (saved ?? []).map(s => s.resource_slug)
  // const progressMap = Object.fromEntries((progress ?? []).map(p => [p.resource_slug, { completed_at: p.completed_at }]))

  return <BibliothequeClient resources={resources} savedResourceSlugs={[]} progressMap={{}} />;
}
