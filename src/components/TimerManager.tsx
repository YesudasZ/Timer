import React, { useEffect } from 'react';
import { useTimerStore } from '../store/useTimerStore';

export const TimerManager: React.FC = () => {
  const { updateTimers } = useTimerStore();

  useEffect(() => {
    // Set up a single interval that updates all timers
    const intervalId = setInterval(() => {
      updateTimers();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [updateTimers]);

  // This is a utility component with no visible UI
  return null;
};