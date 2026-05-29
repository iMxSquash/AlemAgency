export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type ResourceCategory = "TSA" | "TDAH" | "DYS" | "TDI";

export type Category = {
  slug: ResourceCategory;
  label: string;
  color: string;
};

export type ResourceType = "guide" | "fiche" | "outil";

export type ContentSection =
  | { type: "text"; content: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "steps"; title?: string; items: string[] }
  | { type: "tip"; content: string }
  | { type: "warning"; content: string };

export type Resource = {
  slug: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  estimatedReadTime: number;
  tags: string[];
  sections: ContentSection[];
};

export type ForumUserRole = "parent" | "prof" | "expert";

export type ForumAuthor = {
  id: string;
  name: string;
  role: ForumUserRole;
};

export type ForumReply = {
  id: string;
  author: ForumAuthor;
  content: string;
  createdAt: string;
};

export type ForumThread = {
  id: string;
  title: string;
  content: string;
  category: ResourceCategory;
  author: ForumAuthor;
  replies: ForumReply[];
  createdAt: string;
  isPinned?: boolean;
};
