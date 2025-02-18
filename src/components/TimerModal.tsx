import React, { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { useTimerStore } from "../store/useTimerStore";
import { validateTimerForm } from "../utils/validation";
import { Timer } from "../types/timer";
import { Button } from "./Button";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timer?: Timer;
  mode: "add" | "edit";
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  timer,
  mode,
}) => {
  const defaultTimer = {
    id: "",
    title: "",
    description: "",
    duration: 0,
    remainingTime: 0,
    isRunning: false,
  };

  const currentTimer = timer || defaultTimer;

  const [title, setTitle] = useState(currentTimer.title);
  const [description, setDescription] = useState(currentTimer.description);
  const [hours, setHours] = useState(Math.floor(currentTimer.duration / 3600));
  const [minutes, setMinutes] = useState(
    Math.floor((currentTimer.duration % 3600) / 60)
  );
  const [seconds, setSeconds] = useState(currentTimer.duration % 60);
  const [touched, setTouched] = useState({
    title: false,
    hours: false,
    minutes: false,
    seconds: false,
  });

  const { addTimer, editTimer } = useTimerStore();

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && timer) {
        setTitle(timer.title);
        setDescription(timer.description);
        setHours(Math.floor(timer.duration / 3600));
        setMinutes(Math.floor((timer.duration % 3600) / 60));
        setSeconds(timer.duration % 60);
      } else {
        setTitle("");
        setDescription("");
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }

      setTouched({
        title: false,
        hours: false,
        minutes: false,
        seconds: false,
      });
    }
  }, [isOpen, timer, mode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isFormValid = validateTimerForm({ title, description, hours, minutes, seconds });
    
    if (!isFormValid) {
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (mode === "edit" && timer) {
      editTimer(timer.id, {
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
      });
    } else {
      addTimer({
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
        remainingTime: totalSeconds,
        isRunning: false,
      });
    }

    onClose();
  };

  const handleClose = () => {
    onClose();
    setTouched({
      title: false,
      hours: false,
      minutes: false,
      seconds: false,
    });
  };

  const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;
  const isTitleValid = title.trim().length > 0 && title.length <= 50;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              {mode === "add" ? "Add New Timer" : "Edit Timer"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched({ ...touched, title: true })}
              maxLength={50}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                touched.title && !isTitleValid
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter timer title"
            />
            {touched.title && !isTitleValid && (
              <p className="mt-1 text-sm text-red-500">
                Title is required and must be less than 50 characters
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {title.length}/50 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter timer description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Hours
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) =>
                    setHours(Math.min(23, parseInt(e.target.value) || 0))
                  }
                  onBlur={() => setTouched({ ...touched, hours: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) =>
                    setMinutes(Math.min(59, parseInt(e.target.value) || 0))
                  }
                  onBlur={() => setTouched({ ...touched, minutes: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Seconds
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) =>
                    setSeconds(Math.min(59, parseInt(e.target.value) || 0))
                  }
                  onBlur={() => setTouched({ ...touched, seconds: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {touched.hours &&
              touched.minutes &&
              touched.seconds &&
              !isTimeValid && (
                <p className="mt-2 text-sm text-red-500">
                  Please set a duration greater than 0
                </p>
              )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {mode === "add" ? "Add Timer" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};