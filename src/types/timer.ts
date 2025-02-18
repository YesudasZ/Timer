export interface Timer {
  id: string;
  title: string;
  description: string;
  duration: number; 
  remainingTime: number;
  isRunning: boolean;
  createdAt: number;
}