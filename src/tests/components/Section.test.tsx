import { Section } from "@/app/(app)/bibliotheque/[slug]/Section";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Section — type text", () => {
  it("rend le contenu dans un paragraphe", () => {
    render(<Section section={{ type: "text", content: "Un texte de test." }} />);
    expect(screen.getByText("Un texte de test.")).toBeInTheDocument();
    expect(screen.getByText("Un texte de test.").tagName).toBe("P");
  });
});

describe("Section — type list", () => {
  it("rend les items dans une liste non ordonnée", () => {
    render(<Section section={{ type: "list", title: "Mon titre", items: ["Item A", "Item B"] }} />);
    expect(screen.getByText("Mon titre")).toBeInTheDocument();
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
    expect(screen.getByRole("list").tagName).toBe("UL");
  });

  it("n'affiche pas de titre si absent", () => {
    render(<Section section={{ type: "list", items: ["Item A"] }} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});

describe("Section — type steps", () => {
  it("rend les items dans une liste ordonnée", () => {
    render(<Section section={{ type: "steps", title: "Étapes", items: ["Étape 1", "Étape 2"] }} />);
    expect(screen.getByText("Étapes")).toBeInTheDocument();
    expect(screen.getByText("Étape 1")).toBeInTheDocument();
    expect(screen.getByRole("list").tagName).toBe("OL");
  });
});

describe("Section — type tip", () => {
  it("rend le contenu avec la classe de bordure bleue", () => {
    render(<Section section={{ type: "tip", content: "Un conseil utile." }} />);
    expect(screen.getByText("Un conseil utile.")).toBeInTheDocument();
    expect(screen.getByText("Un conseil utile.").closest("div")).toHaveClass("border-blue-400");
  });
});

describe("Section — type warning", () => {
  it("rend le contenu avec la classe de bordure ambre", () => {
    render(<Section section={{ type: "warning", content: "Attention !" }} />);
    expect(screen.getByText("Attention !")).toBeInTheDocument();
    expect(screen.getByText("Attention !").closest("div")).toHaveClass("border-amber-400");
  });
});
