import { useRef } from 'react';
import { toast } from 'sonner';
import { TimerAudio } from '../utils/audio';

export function useToast() {
  const toastIdRef = useRef<string | number | null>(null);
  const timerAudio = TimerAudio.getInstance();

  const showTimerEndToast = (title: string, isMobile: boolean) => {
    timerAudio.playFor5Seconds().catch(console.error);

    toastIdRef.current = toast.success(
      `Timer "${title}" has ended!`,
      {
        duration: 5000,
        position: isMobile ? "bottom-center" : "top-right",
        action: {
          label: "Dismiss",
          onClick: () => {
            dismissToast();
          },
        },
        onDismiss: () => {
          dismissToast();
        },
      }
    );
  };

  const dismissToast = () => {
    if (toastIdRef.current) {
      timerAudio.stop();
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  };

  return {
    showTimerEndToast,
    dismissToast,
    hasActiveToast: () => toastIdRef.current !== null
  };
}