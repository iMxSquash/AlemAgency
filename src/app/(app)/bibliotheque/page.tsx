import { BibliothequeClient } from "@/components/bibliotheque/BibliothequeClient";
import type { Resource } from "@/types/bibliotheque";
import resourcesData from "@/lib/data/resources.json";

export const metadata = {
  title: "Bibliothèque — Zenko",
  description: "Fiches pratiques, scripts, vidéos pour enseignants.",
};

export default function BibliothequePage() {
  const resources = resourcesData as Resource[];

  //wire up Supabase
  // const supabase = createServerClient()
  // const { data: saved } = await supabase.from("saved_resources").select("resource_id")
  // const { data: progress } = await supabase.from("reading_progress").select("resource_id, completed_at")
  // const savedResourceIds = (saved ?? []).map(s => s.resource_id)
  // const progressMap = Object.fromEntries((progress ?? []).map(p => [p.resource_id, { completed_at: p.completed_at }]))

  return (
    <BibliothequeClient
      resources={resources}
      savedResourceIds={[]}
      progressMap={{}}
    />
  );
}