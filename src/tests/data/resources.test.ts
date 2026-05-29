import categoriesData from "@/lib/data/categories.json";
import resourcesData from "@/lib/data/resources.json";
import type { Resource, ResourceCategory, ResourceType } from "@/types";
import { describe, expect, it } from "vitest";

const VALID_CATEGORIES: ResourceCategory[] = ["TSA", "TDAH", "DYS", "TDI"];
const VALID_TYPES: ResourceType[] = ["guide", "fiche", "outil"];
const VALID_SECTION_TYPES = ["text", "list", "steps", "tip", "warning"];

const resources = resourcesData as Resource[];

describe("resources.json", () => {
  it("contains 12 resources", () => {
    expect(resources).toHaveLength(12);
  });

  it("all slugs are unique", () => {
    const slugs = resources.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("all slugs are kebab-case", () => {
    for (const r of resources) {
      expect(r.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("every resource has required fields", () => {
    for (const r of resources) {
      expect(r.slug).toBeTruthy();
      expect(r.title).toBeTruthy();
      expect(r.description).toBeTruthy();
      expect(r.estimatedReadTime).toBeGreaterThan(0);
      expect(r.sections.length).toBeGreaterThan(0);
      expect(r.tags.length).toBeGreaterThan(0);
    }
  });

  it("every resource has a valid category", () => {
    for (const r of resources) {
      expect(VALID_CATEGORIES).toContain(r.category);
    }
  });

  it("every resource has a valid type", () => {
    for (const r of resources) {
      expect(VALID_TYPES).toContain(r.type);
    }
  });

  it("every section has a valid type", () => {
    for (const r of resources) {
      for (const section of r.sections) {
        expect(VALID_SECTION_TYPES).toContain(section.type);
      }
    }
  });

  it("has 3 resources per category", () => {
    for (const category of VALID_CATEGORIES) {
      const count = resources.filter((r) => r.category === category).length;
      expect(count).toBe(3);
    }
  });
});

describe("categories.json", () => {
  it("contains all 4 categories", () => {
    const slugs = categoriesData.map((c) => c.slug);
    for (const category of VALID_CATEGORIES) {
      expect(slugs).toContain(category);
    }
  });

  it("every category has label and color", () => {
    for (const c of categoriesData) {
      expect(c.label).toBeTruthy();
      expect(c.color).toBeTruthy();
    }
  });

  it("every color contains bg- and text- classes", () => {
    for (const c of categoriesData) {
      expect(c.color).toMatch(/bg-\S+/);
      expect(c.color).toMatch(/text-\S+/);
    }
  });
});
