// Day.tsx
import React from 'react';

interface DayProps {
  day: number;
  isSelected: boolean;
  onDateClick: (day: number) => void;
}

const Day: React.FC<DayProps> = ({ day, isSelected, onDateClick }) => {
  const handleClick = () => {
    onDateClick(day);
  };

  return (
    <div
      className={`day ${day === 0 ? 'empty' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {day !== 0 && day}
    </div>
  );
};

export default Day;
