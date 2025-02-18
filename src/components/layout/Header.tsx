import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  onAddTimerClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddTimerClick }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Clock className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Timer App</h1>
      </div>
      <Button onClick={onAddTimerClick} variant="primary">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Timer
        </div>
      </Button>
    </div>
  );
};