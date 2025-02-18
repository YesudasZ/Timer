import React, { useEffect } from 'react';
import { useTimerStore } from '../../store/useTimerStore';

export const TimerManager: React.FC = () => {
  const { updateTimers } = useTimerStore();

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTimers();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [updateTimers]);
  return null;
};