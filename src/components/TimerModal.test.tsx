import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TimerModal } from "../components/TimerModal";
import { useTimerStore } from "../store/useTimerStore";
import * as validation from "../utils/validation";
import "@testing-library/jest-dom";

vi.mock("../store/useTimerStore", () => ({
  useTimerStore: vi.fn(),
}));

vi.mock("../utils/validation", async () => {
  const actual = await vi.importActual("../utils/validation");
  return {
    ...actual,
    validateTimerForm: vi.fn(),
    showValidationToast: vi.fn(),
  };
});

describe("TimerModal Component", () => {
  const mockAddTimer = vi.fn();
  const mockEditTimer = vi.fn();
  const mockOnClose = vi.fn();

  const mockTimer = {
    id: "timer-1",
    title: "Test Timer",
    description: "Test Description",
    duration: 3665,
    remainingTime: 3665,
    isRunning: false,
    createdAt: Date.now(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTimerStore).mockReturnValue({
      timers: [],
      addTimer: mockAddTimer,
      editTimer: mockEditTimer,
      deleteTimer: vi.fn(),
      toggleTimer: vi.fn(),
      updateTimers: vi.fn(),
      restartTimer: vi.fn(),
    });

    vi.mocked(validation.validateTimerForm).mockReturnValue(true);
  });

  it("renders correctly in add mode", () => {
    render(<TimerModal isOpen={true} onClose={mockOnClose} mode="add" />);

    expect(screen.getByText("Add New Timer")).toBeInTheDocument();
    expect(screen.getByText("Add Timer")).toBeInTheDocument();

    expect(screen.getByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/description/i)).toHaveValue("");
    expect(screen.getByLabelText(/hours/i)).toHaveValue("0");
    expect(screen.getByLabelText(/minutes/i)).toHaveValue("0");
    expect(screen.getByLabelText(/seconds/i)).toHaveValue("0");
  });

  it("renders correctly in edit mode with timer data", () => {
    render(
      <TimerModal
        isOpen={true}
        onClose={mockOnClose}
        timer={mockTimer}
        mode="edit"
      />
    );

    expect(screen.getByText("Edit Timer")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();

    expect(screen.getByLabelText(/title/i)).toHaveValue("Test Timer");
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      "Test Description"
    );
    expect(screen.getByLabelText(/hours/i)).toHaveValue("1");
    expect(screen.getByLabelText(/minutes/i)).toHaveValue("1");
    expect(screen.getByLabelText(/seconds/i)).toHaveValue("5");
  });

  it("does not render when isOpen is false", () => {
    render(<TimerModal isOpen={false} onClose={mockOnClose} mode="add" />);

    expect(screen.queryByText("Add New Timer")).not.toBeInTheDocument();
  });

  it("validates form and adds timer when valid in add mode", async () => {
    render(<TimerModal isOpen={true} onClose={mockOnClose} mode="add" />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New Timer" },
    });
    fireEvent.change(screen.getByLabelText(/hours/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/minutes/i), {
      target: { value: "30" },
    });

    fireEvent.click(screen.getByText("Add Timer"));

    expect(validation.validateTimerForm).toHaveBeenCalledWith({
      title: "New Timer",
      description: "",
      hours: 2,
      minutes: 30,
      seconds: 0,
    });

    await waitFor(() => {
      expect(mockAddTimer).toHaveBeenCalledWith({
        title: "New Timer",
        description: "",
        duration: 9000,
        remainingTime: 9000,
        isRunning: false,
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("validates form and edits timer when valid in edit mode", async () => {
    render(
      <TimerModal
        isOpen={true}
        onClose={mockOnClose}
        timer={mockTimer}
        mode="edit"
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Updated Timer" },
    });
    fireEvent.change(screen.getByLabelText(/minutes/i), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByText("Save Changes"));

    expect(validation.validateTimerForm).toHaveBeenCalledWith({
      title: "Updated Timer",
      description: "Test Description",
      hours: 1,
      minutes: 5,
      seconds: 5,
    });

    await waitFor(() => {
      expect(mockEditTimer).toHaveBeenCalledWith("timer-1", {
        title: "Updated Timer",
        description: "Test Description",
        duration: 3905,
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("does not submit when validation fails", async () => {
    vi.mocked(validation.validateTimerForm).mockReturnValue(false);

    render(<TimerModal isOpen={true} onClose={mockOnClose} mode="add" />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Invalid Timer" },
    });

    fireEvent.click(screen.getByText("Add Timer"));

    expect(validation.validateTimerForm).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockAddTimer).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it("handles close button correctly", () => {
    render(<TimerModal isOpen={true} onClose={mockOnClose} mode="add" />);

    fireEvent.click(screen.getByRole("button", { name: "" }));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles Cancel button correctly", () => {
    render(<TimerModal isOpen={true} onClose={mockOnClose} mode="add" />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows validation error messages when fields are touched", async () => {
    render(<TimerModal isOpen={true} onClose={mockOnClose} mode="add" />);

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.focus(titleInput);
    fireEvent.blur(titleInput);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Title is required and must be less than 50 characters"
        )
      ).toBeInTheDocument();
    });

    const hoursInput = screen.getByLabelText(/hours/i);
    const minutesInput = screen.getByLabelText(/minutes/i);
    const secondsInput = screen.getByLabelText(/seconds/i);

    fireEvent.focus(hoursInput);
    fireEvent.blur(hoursInput);
    fireEvent.focus(minutesInput);
    fireEvent.blur(minutesInput);
    fireEvent.focus(secondsInput);
    fireEvent.blur(secondsInput);

    await waitFor(() => {
      expect(
        screen.getByText("Please set a duration greater than 0")
      ).toBeInTheDocument();
    });
  });
});
