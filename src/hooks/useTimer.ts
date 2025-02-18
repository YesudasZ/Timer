import { useState, useRef, useEffect } from 'react';
import { useTimerStore } from '../store/useTimerStore';
import { useMediaQuery } from './useMediaQuery';
import { useToast } from './useToast';
import { Timer } from '../types/timer';

export function useTimer(timer: Timer) {
  const { toggleTimer, deleteTimer, restartTimer } = useTimerStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const hasEndedRef = useRef(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { showTimerEndToast, dismissToast, hasActiveToast } = useToast();

  useEffect(() => {
    if (timer.remainingTime <= 0 && timer.isRunning === false && !hasEndedRef.current) {
      hasEndedRef.current = true;
      showTimerEndToast(timer.title, isMobile);
    }
  }, [timer.remainingTime, timer.isRunning, timer.title, isMobile, showTimerEndToast]);

  useEffect(() => {
    return () => {
      if (hasActiveToast()) {
        dismissToast();
      }
    };
  }, [dismissToast, hasActiveToast]);

  const handleRestart = () => {
    dismissToast();
    hasEndedRef.current = false;
    restartTimer(timer.id);
  };

  const handleDelete = () => {
    dismissToast();
    deleteTimer(timer.id);
  };

  const handleToggle = () => {
    if (timer.remainingTime <= 0) {
      dismissToast();
      hasEndedRef.current = false;
    }
    toggleTimer(timer.id);
  };

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    handleRestart,
    handleDelete,
    handleToggle
  };
}