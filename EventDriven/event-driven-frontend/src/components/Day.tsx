import React, { useState } from 'react';
import { DayObject } from './Calendar';
import '../styles/Day.css';
import Button from '@mui/material/Button';
import SimpleDialog, { SimpleDialogProps } from './SimpleDialog';
import { blue } from '@mui/material/colors';

interface DayProps {
  day: DayObject;
  isSelected: boolean;
  onDateClick: (day: DayObject) => void;
}

const Day: React.FC<DayProps> = ({ day, isSelected, onDateClick }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleClick = () => {
    onDateClick(day);
  };

  const addDocumentClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose: SimpleDialogProps['onClose'] = (value) => {
    setSelectedOption(value);
    
  };

  const handleCreateButtonClick = () => {
    setOpenDialog(false);
    console.log(selectedOption);
  };

  return (
    <div
      className={`day ${day.day === 0 ? 'empty' : ''} ${isSelected ? 'selected' : ''} `}
      onClick={handleClick}
    >
      <div className='dayEvents'>
        <label className={`dayLabel ${day.isCurrentMonth ? '' : 'faded'}`}>
          {day.day !== 0 && day.day}        
        </label>
      </div>

      <button className={`addEvent ${day.isCurrentMonth ? '' : 'faded'}`} onClick={addDocumentClick}>
        +
      </button>

      <SimpleDialog
        selectedValue=""
        open={openDialog}
        onClose={handleDialogClose}
        selectedOption={selectedOption}
        onCreateButtonClick={handleCreateButtonClick}
      />
    </div>
  );
};

export default Day;
