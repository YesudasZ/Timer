import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TimerItem } from "../components/TimerItem";
import { useTimerStore } from "../store/useTimerStore";
import { TimerAudio } from "../utils/audio";
import { toast } from "sonner";
import "@testing-library/jest-dom";

vi.mock("../store/useTimerStore", () => ({
  useTimerStore: vi.fn(),
}));

vi.mock("../utils/audio", () => ({
  TimerAudio: {
    getInstance: vi.fn(() => ({
      playFor5Seconds: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn(),
    })),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn().mockReturnValue("toast-id"),
    dismiss: vi.fn(),
  },
}));

const mockSetInterval = vi.fn((callback) => {
  callback();
  return 123;
});

const mockClearInterval = vi.fn();

const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

describe("TimerItem Component", () => {
  const mockToggleTimer = vi.fn();
  const mockDeleteTimer = vi.fn();
  const mockUpdateTimer = vi.fn();
  const mockRestartTimer = vi.fn();

  const mockTimer = {
    id: "timer-1",
    title: "Test Timer",
    description: "Test Description",
    duration: 300,
    remainingTime: 300,
    isRunning: false,
    createdAt: Date.now(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    window.setInterval = mockSetInterval;
    window.clearInterval = mockClearInterval;

    vi.mocked(useTimerStore).mockReturnValue({
      timers: [mockTimer],
      addTimer: vi.fn(),
      deleteTimer: mockDeleteTimer,
      toggleTimer: mockToggleTimer,
      updateTimers: mockUpdateTimer,
      restartTimer: mockRestartTimer,
      editTimer: vi.fn(),
    });

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    window.setInterval = originalSetInterval;
    window.clearInterval = originalClearInterval;
  });

  it("renders timer correctly", () => {
    render(<TimerItem timer={mockTimer} />);

    expect(screen.getByText("Test Timer")).toBeInTheDocument();
    expect(screen.getByText("05:00")).toBeInTheDocument();
  });

  it("handles timer toggle when clicked", () => {
    render(<TimerItem timer={mockTimer} />);

    const playButton = screen.getByTitle("Start Timer");
    fireEvent.click(playButton);

    expect(mockToggleTimer).toHaveBeenCalledWith("timer-1");
  });

  it("handles restart when clicked", () => {
    render(<TimerItem timer={mockTimer} />);

    const restartButton = screen.getByTitle("Restart Timer");
    fireEvent.click(restartButton);

    expect(mockRestartTimer).toHaveBeenCalledWith("timer-1");
  });

  it("handles delete when clicked", () => {
    render(<TimerItem timer={mockTimer} />);

    const deleteButton = screen.getByTitle("Delete Timer");
    fireEvent.click(deleteButton);

    expect(mockDeleteTimer).toHaveBeenCalledWith("timer-1");
  });

  it("sets up interval when timer is running", () => {
    const runningTimer = { ...mockTimer, isRunning: true };
    render(<TimerItem timer={runningTimer} />);

    expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  it("shows toast and plays sound when timer reaches zero", async () => {
    const almostDoneTimer = { ...mockTimer, isRunning: true, remainingTime: 1 };
    render(<TimerItem timer={almostDoneTimer} />);

    await waitFor(() => {
      expect(TimerAudio.getInstance().playFor5Seconds).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        'Timer "Test Timer" has ended!',
        expect.objectContaining({
          duration: 5000,
          position: "top-right",
        })
      );
    });
  });

  it("stops sound and dismisses toast when unmounted", async () => {
    const runningTimer = { ...mockTimer, isRunning: true, remainingTime: 1 };
    const { unmount } = render(<TimerItem timer={runningTimer} />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });

    unmount();

    expect(TimerAudio.getInstance().stop).toHaveBeenCalled();
    expect(toast.dismiss).toHaveBeenCalledWith("toast-id");
  });

  it("shows toast with different position on mobile", async () => {
    window.innerWidth = 600;

    const almostDoneTimer = { ...mockTimer, isRunning: true, remainingTime: 1 };
    render(<TimerItem timer={almostDoneTimer} />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          position: "bottom-center",
        })
      );
    });
  });
});
