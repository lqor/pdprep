import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "@/components/ui/card";

describe("Card", () => {
  it("renders with children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies card class", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card")).toHaveClass("card");
  });

  it("merges custom className", () => {
    render(<Card data-testid="card" className="bg-red-500">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("card");
    expect(card).toHaveClass("bg-red-500");
  });
});
