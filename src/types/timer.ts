export interface Timer {
  id: string;
  title: string;
  description: string;
  duration: number; 
  remainingTime: number;
  isRunning: boolean;
  createdAt: number;
}

export interface TimerFormData {
  title: string;
  description: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CreateTimerPayload {
  title: string;
  description: string;
  duration: number;
  remainingTime: number;
  isRunning: boolean;
}

export interface UpdateTimerPayload {
  title: string;
  description: string;
  duration: number;
}

export type TimerModalMode = 'add' | 'edit';

export interface TimerStoreState {
  timers: Timer[];
  addTimer: (payload: CreateTimerPayload) => void;
  editTimer: (id: string, payload: UpdateTimerPayload) => void;
  deleteTimer: (id: string) => void;
  toggleTimer: (id: string) => void;
  restartTimer: (id: string) => void;
}