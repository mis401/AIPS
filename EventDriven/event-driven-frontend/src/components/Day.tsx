import React, { useState } from 'react';
import { DayObject } from './Calendar';
import '../styles/Day.css';
// import SimpleDialog, { SimpleDialogProps } from './SimpleDialog';
import DocumentEditorDialog from './DocumentEditorDialog';
import useAuth from '../hooks/useAuth';
import DayAddDialog from './DayAddDialog';
import { DocumentType, NewDocumentDTO } from '../dtos/NewDocument';

interface DayProps {
  day: DayObject;
  isSelected: boolean;
  isCurrentDay: boolean;
  onDateClick: (day: DayObject) => void;
  communityId: number;
}

const Day: React.FC<DayProps> = ({ day, isSelected, isCurrentDay, onDateClick }) => {
  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [openEditor, setOpenEditor] = useState(false);
  const { auth } = useAuth();
  const userInState = auth?.user;

  const[openAddDialog, setOpenAddDialog] = useState(false);

  const handleClick = () => {
    onDateClick(day);
  };
  
    const handleSaveDocument = async (content: string, type: DocumentType) => {
      setOpenAddDialog(true);

      
    };

    const setDocumentName = (documentName: string) => {
      console.log(documentName);
    }

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

      <DayAddDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onCreateButtonClick={setDocumentName}
        title="Create a new document"
      />

    </div>
  );
};

export default Day;