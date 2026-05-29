import { SaveButton } from "@/app/(app)/bibliotheque/[slug]/SaveButton";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("SaveButton", () => {
  it("affiche 'Sauvegarder' quand isSaved est false", () => {
    render(<SaveButton isSaved={false} />);
    expect(screen.getByRole("button")).toHaveTextContent("Sauvegarder");
  });

  it("est activé quand isSaved est false", () => {
    render(<SaveButton isSaved={false} />);
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("affiche 'Sauvegardée ✓' quand isSaved est true", () => {
    render(<SaveButton isSaved={true} />);
    expect(screen.getByRole("button")).toHaveTextContent("Sauvegardée ✓");
  });

  it("est désactivé quand isSaved est true", () => {
    render(<SaveButton isSaved={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
