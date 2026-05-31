"use client";

import type { FilterCategory, Resource } from "@/types/index";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { FeaturedBanner } from "./FeaturedBanner";
import { ResourceCard } from "./ResourceCard";

const FILTER_PILLS_CONFIG: { label: string; value: FilterCategory }[] = [
  { label: "Toutes", value: "Toutes" },
  { label: "TSA", value: "TSA" },
  { label: "TDAH", value: "TDAH" },
  { label: "DYS", value: "DYS" },
  { label: "TDI", value: "TDI" },
];

interface Props {
  resources: Resource[];
  savedResourceSlugs?: string[];
  progressMap?: Record<string, { completed_at: string | null }>;
}

export function BibliothequeClient({
  resources,
  savedResourceSlugs = [],
  progressMap = {},
}: Props) {
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<FilterCategory>>(
    new Set(["Toutes"])
  );

  function toggleCategory(val: FilterCategory) {
    if (val === "Toutes") {
      setActiveCategories(new Set(["Toutes"]));
      return;
    }
    const next = new Set(activeCategories);
    next.delete("Toutes");
    if (next.has(val)) {
      next.delete(val);
      if (next.size === 0) next.add("Toutes");
    } else {
      next.add(val);
    }
    setActiveCategories(next);
  }

  const filterPills = useMemo(
    () =>
      FILTER_PILLS_CONFIG.map(({ label, value }) => ({
        label,
        value,
        count:
          value === "Toutes"
            ? resources.length
            : resources.filter((r) => r.category === value).length,
      })),
    [resources]
  );

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchCat =
        activeCategories.has("Toutes") || activeCategories.has(r.category as FilterCategory);
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [resources, activeCategories, search]);

  const savedSet = new Set(savedResourceSlugs);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "32px",
        padding: "32px 40px",
        flex: "1 0 0",
      }}
    >
      {/* Page header */}
      <div>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
            margin: 0,
            marginBottom: 6,
          }}
        >
          Bibliothèque
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            color: "#6B7280",
            margin: 0,
          }}
        >
          Fiches pratique qu&apos;un enseignant / intervenant peut ouvrir entre deux cours et
          appliquer le lendemain.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          alignSelf: "stretch",
        }}
      >
        {/* Search bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            alignSelf: "stretch",
            border: "1px solid #E8E7E3",
            borderRadius: 10,
            padding: "0 16px",
            background: "#FFFFFF",
          }}
        >
          <Search
            style={{
              width: 16,
              height: 16,
              color: "#171614",
              flexShrink: 0,
              strokeWidth: 2.5,
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Rechercher "dyslexie"...'
            className="placeholder-[#A6A39B]"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#171614",
              lineHeight: "normal",
              padding: "12px 0",
              background: "transparent",
            }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {filterPills.map(({ label, value, count }) => {
            const isActive = activeCategories.has(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleCategory(value)}
                className="flex items-center transition-colors"
                style={{
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 999,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? "#111827" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#374151",
                  border: isActive ? "1.5px solid #111827" : "1.5px solid #D1D5DB",
                  cursor: "pointer",
                }}
              >
                {label}
                <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.7 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured banner */}
      <div style={{ alignSelf: "stretch" }}>
        <FeaturedBanner />
      </div>

      {/* Resource grid */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center text-gray-400"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          <Search style={{ width: 36, height: 36, opacity: 0.25, marginBottom: 12 }} />
          <p style={{ fontSize: 14 }}>Aucune ressource trouvée.</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategories(new Set(["Toutes"]));
            }}
            style={{
              color: "#2F9DD4",
              fontSize: 13,
              marginTop: 12,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "24px",
            alignSelf: "stretch",
            flexWrap: "wrap",
          }}
        >
          {filtered.map((r) => {
            const progress = progressMap[r.slug];
            return (
              <ResourceCard
                key={r.slug}
                resource={r}
                href={`/bibliotheque/${r.slug}`}
                isSaved={savedSet.has(r.slug)}
                isInProgress={!!progress && !progress.completed_at}
                isRead={!!progress?.completed_at}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
