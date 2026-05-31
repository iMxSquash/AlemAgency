import { SaveButton } from "@/app/(app)/bibliotheque/[slug]/SaveButton";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("SaveButton", () => {
  it("has aria-label 'Sauvegarder' when isSaved is false", () => {
    render(<SaveButton isSaved={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Sauvegarder");
  });

  it("is enabled when isSaved is false", () => {
    render(<SaveButton isSaved={false} />);
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("has aria-label 'Retirer des sauvegardés' when isSaved is true", () => {
    render(<SaveButton isSaved={true} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Retirer des sauvegardés");
  });

  it("is enabled when isSaved is true", () => {
    render(<SaveButton isSaved={true} />);
    expect(screen.getByRole("button")).toBeEnabled();
  });
});
