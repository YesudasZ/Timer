import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../components/Button";

describe("Button Component", () => {
  it("renders with correct text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("applies primary variant styles by default", () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByText("Primary Button");
    expect(button.classList.contains("bg-blue-600")).toBe(true);
    expect(button.classList.contains("text-white")).toBe(true);
  });

  it("applies secondary variant styles when specified", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText("Secondary Button");
    expect(button.classList.contains("bg-gray-100")).toBe(true);
    expect(button.classList.contains("text-gray-700")).toBe(true);
  });

  it("handles disabled state correctly", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText("Disabled Button");
    expect(button).toBeDisabled();
    expect(button.classList.contains("bg-blue-400")).toBe(true);
    expect(button.classList.contains("cursor-not-allowed")).toBe(true);
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );

    fireEvent.click(screen.getByText("Disabled Button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders correct button type when specified", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByText("Submit")).toHaveAttribute("type", "submit");

    render(<Button type="reset">Reset</Button>);
    expect(screen.getByText("Reset")).toHaveAttribute("type", "reset");
  });
});
