export type ResourceCategory = "Autisme" | "TDAH" | "Dyslexie" | "Comportement" | "Motricité";

export type FilterCategory = "Toutes" | ResourceCategory;

export type ResourceType = "Fiche" | "Article" | "Vidéo" | "Script";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  author: string;
  duration: number;
  views: number;
}
