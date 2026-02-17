import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders with children", () => {
    render(<Badge>PD1</Badge>);
    expect(screen.getByText("PD1")).toBeInTheDocument();
  });

  it("applies badge class", () => {
    render(<Badge data-testid="badge">Label</Badge>);
    expect(screen.getByTestId("badge")).toHaveClass("badge");
  });

  it("merges custom className", () => {
    render(<Badge data-testid="badge" className="bg-green-500">Success</Badge>);
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveClass("badge");
    expect(badge).toHaveClass("bg-green-500");
  });
});
