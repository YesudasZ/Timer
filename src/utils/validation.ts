import { toast } from 'sonner';
import { TimerFormData } from '../types/timer';

export const validateTimerForm = (data: TimerFormData): boolean => {
  const { title, hours, minutes, seconds } = data;
  
  if (!title.trim()) {
    showValidationToast('Title is required');
    return false;
  }

  if (title.length > 50) {
    showValidationToast('Title must be less than 50 characters');
    return false;
  }

  if (hours < 0 || minutes < 0 || seconds < 0) {
    showValidationToast('Time values cannot be negative');
    return false;
  }

  if (minutes > 59 || seconds > 59) {
    showValidationToast('Minutes and seconds must be between 0 and 59');
    return false;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds === 0) {
    showValidationToast('Please set a time greater than 0');
    return false;
  }

  if (totalSeconds > 86400) {
    showValidationToast('Timer cannot exceed 24 hours');
    return false;
  }

  return true;
};

export const showValidationToast = (message: string) => {
  const isMobile = window.innerWidth < 768;
  toast.error(message, {
    position: isMobile ? 'bottom-center' : 'top-right',
    duration: 4000,
  });
};