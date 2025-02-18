import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateTimerForm,
  showValidationToast,
} from "../utils/validation";
import { toast } from "sonner";
import { TimerFormData } from "../types/timer";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("validateTimerForm", () => {
  let validFormData: TimerFormData;

  beforeEach(() => {
    vi.clearAllMocks();

    validFormData = {
      title: "Test Timer",
      description: "This is a test timer",
      hours: 1,
      minutes: 30,
      seconds: 0,
    };
  });

  it("should return true for valid form data", () => {
    const result = validateTimerForm(validFormData);
    expect(result).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should validate empty title", () => {
    const result = validateTimerForm({ ...validFormData, title: "" });
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Title is required",
      expect.any(Object)
    );
  });

  it("should validate title length", () => {
    const longTitle = "a".repeat(51);
    const result = validateTimerForm({ ...validFormData, title: longTitle });
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Title must be less than 50 characters",
      expect.any(Object)
    );
  });

  it("should validate negative time values", () => {
    const result = validateTimerForm({ ...validFormData, hours: -1 });
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Time values cannot be negative",
      expect.any(Object)
    );
  });

  it("should validate minutes range", () => {
    const result = validateTimerForm({ ...validFormData, minutes: 60 });
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Minutes and seconds must be between 0 and 59",
      expect.any(Object)
    );
  });

  it("should validate seconds range", () => {
    const result = validateTimerForm({ ...validFormData, seconds: 60 });
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Minutes and seconds must be between 0 and 59",
      expect.any(Object)
    );
  });

  it("should validate zero total time", () => {
    const result = validateTimerForm({
      ...validFormData,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Please set a time greater than 0",
      expect.any(Object)
    );
  });

  it("should validate time exceeding 24 hours", () => {
    const result = validateTimerForm({ ...validFormData, hours: 25 });
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Timer cannot exceed 24 hours",
      expect.any(Object)
    );
  });
});

describe("showValidationToast", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("should show toast with top-right position on desktop", () => {
    showValidationToast("Test message");
    expect(toast.error).toHaveBeenCalledWith("Test message", {
      position: "top-right",
      duration: 4000,
    });
  });

  it("should show toast with bottom-center position on mobile", () => {
    window.innerWidth = 600;

    showValidationToast("Test message");
    expect(toast.error).toHaveBeenCalledWith("Test message", {
      position: "bottom-center",
      duration: 4000,
    });
  });
});
