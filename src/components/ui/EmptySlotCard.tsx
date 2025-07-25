
import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from './card';
import { Button } from './button';

interface EmptySlotCardProps {
  time: string;
  date: Date;
  onSchedulePost: (date: Date, time: string) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  isDragOver?: boolean;
}

const EmptySlotCard: React.FC<EmptySlotCardProps> = ({
  time,
  date,
  onSchedulePost,
  onDrop,
  onDragOver,
  isDragOver = false
}) => {
  const handleClick = () => {
    onSchedulePost(date, time);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };

  return (
    <Card
      className={`border-2 border-dashed transition-all cursor-pointer ${isDragOver
        ? 'border-blue-500 bg-blue-50/50'
        : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100/50'
        }`}
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex items-center gap-4 px-6 py-4 " onClick={handleClick}>
        <div className="text-sm font-medium text-gray-400 min-w-[80px]">
          {time}
        </div>

        <div className="flex-1">
          <div className="text-sm text-gray-500 flex items-center">
            {/* className="h-auto p-0 text-gray-500 hover:text-gray-700 font-normal" */}

            <Plus className="h-4 w-4 mr-2" />
            Schedule for {time}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmptySlotCard;
