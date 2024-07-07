import React, { useState } from 'react';
import { DayObject } from './Calendar';
import '../styles/Day.css';
// import SimpleDialog, { SimpleDialogProps } from './SimpleDialog';
import DocumentEditorDialog from './DocumentEditorDialog';

interface DayProps {
  day: DayObject;
  isSelected: boolean;
  isCurrentDay: boolean;
  onDateClick: (day: DayObject) => void;
}

const Day: React.FC<DayProps> = ({ day, isSelected, isCurrentDay, onDateClick }) => {
  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [openEditor, setOpenEditor] = useState(false);


  const handleClick = () => {
    onDateClick(day);
  };
  
    const handleSaveDocument = (content: string, type: string) => {
      console.log('Document saved:', { content, type });
     };

  // const addDocumentClick = () => {
  //   setOpenDialog(true);
  // };

  // const handleDialogClose: SimpleDialogProps['onClose'] = (value) => {
  //   setSelectedOption(value);
  //   setOpenDialog(false);
  // };

  // const handleCreateButtonClick = () => {
  //   setOpenDialog(false);
  //   console.log(selectedOption);
  // };

  return (
    <div
      className={`day ${day.day === 0 ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isCurrentDay ? 'currentDay' : ''} `}
      onClick={handleClick}
    >
      <div className='dayEvents'>
        <label className={`dayLabel ${day.isCurrentMonth ? '' : 'faded'}`}>
          {day.day !== 0 && day.day}        
        </label>
      </div>

      <button className={`addEvent ${day.isCurrentMonth ? '' : 'faded'}`} onClick={() => setOpenEditor(true)}>
        +
      </button>

      <DocumentEditorDialog
        open={openEditor}
        onClose={() => setOpenEditor(false)}
        onSave={handleSaveDocument}
      />

      {/* <SimpleDialog
        selectedValue=""
        open={openDialog}
        onClose={handleDialogClose}
        selectedOption={selectedOption}
        onCreateButtonClick={handleCreateButtonClick}
        title="Create a new document"
        options={['Text Document', 'To-do List', 'Whiteboard']}
        buttonText='Create'
      /> */}
    </div>
  );
};

export default Day;