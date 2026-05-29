import { CompleteButton } from "@/app/(app)/bibliotheque/[slug]/CompleteButton";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("CompleteButton", () => {
  it("affiche 'Marquer comme terminé' quand isCompleted est false", () => {
    render(<CompleteButton isCompleted={false} />);
    expect(screen.getByRole("button")).toHaveTextContent("Marquer comme terminé");
  });

  it("est activé quand isCompleted est false", () => {
    render(<CompleteButton isCompleted={false} />);
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("affiche 'Lu ✓' quand isCompleted est true", () => {
    render(<CompleteButton isCompleted={true} />);
    expect(screen.getByRole("button")).toHaveTextContent("Lu ✓");
  });

  it("est désactivé quand isCompleted est true", () => {
    render(<CompleteButton isCompleted={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
