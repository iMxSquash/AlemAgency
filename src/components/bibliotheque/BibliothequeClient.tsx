"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ResourceCard } from "./ResourceCard";
import { FeaturedBanner } from "./FeaturedBanner";
import type { Resource, FilterCategory } from "@/types/bibliotheque";

const FILTER_PILLS: { label: string; value: FilterCategory; count: number }[] = [
  { label: "Toutes", value: "Toutes",       count: 124 },
  { label: "TSA",    value: "Autisme",      count: 124 },
  { label: "TDAH",   value: "TDAH",         count: 124 },
  { label: "DYS",    value: "Dyslexie",     count: 124 },
  { label: "TDI",    value: "Comportement", count: 124 },
];

interface Props {
  resources: Resource[];
  savedResourceIds?: string[];
  progressMap?: Record<string, { completed_at: string | null }>;
}

export function BibliothequeClient({
  resources,
  savedResourceIds = [],
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

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchCat =
        activeCategories.has("Toutes") ||
        activeCategories.has(r.category as FilterCategory);
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [resources, activeCategories, search]);

  const savedSet = new Set(savedResourceIds);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "32px",
        padding: "32px 0px",
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
          Fiches pratique qu&apos;un enseignant / intervenant peut ouvrir entre
          deux cours et appliquer le lendemain.
        </p>
      </div>

      {/*
        Figma: display flex, flex-direction column, align-items flex-start,
        gap 16px, align-self stretch
        — wraps search bar + filter pills together
      */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          alignSelf: "stretch",
          
        }}
      >
        {/*
          Search bar bloc:
          display: flex; align-items: center; gap: 16px; align-self: stretch;
        */}
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
          {/* Icon — matches typography: color #171614, size 16px */}
          <Search
            style={{
              width: 16,
              height: 16,
              color: "#171614",
              flexShrink: 0,
              strokeWidth: 2.5,
            }}
          />
          {/* Input text — color #A6A39B, Inter 14px weight 400 */}
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
        {FILTER_PILLS.map(({ label, value, count }) => {
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
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  opacity: 0.7,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
        </div>
        {/* end search+pills wrapper */}
      </div>

      {/* Featured banner */}
      <div style={{}}>
        <FeaturedBanner />
      </div>

      {/* Resource grid — 3 cols, gap 24 */}
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
            style={{ color: "#2F9DD4", fontSize: 13, marginTop: 12, background: "none", border: "none", cursor: "pointer" }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "54px",
            alignSelf: "stretch",
            flexWrap: "wrap",
          }}
        >
          {filtered.map((r) => {
            const progress = progressMap[r.id];
            return (
              <ResourceCard
                key={r.id}
                resource={r}
                isSaved={savedSet.has(r.id)}
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