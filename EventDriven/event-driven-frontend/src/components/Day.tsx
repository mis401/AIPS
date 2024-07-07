import React, { useState } from 'react';
import { DayObject } from './Calendar';
import '../styles/Day.css';
import DayAddDialog from './DayAddDialog';
import DocumentEditorDialog from './DocumentEditorDialog';
import { useSelector } from 'react-redux';

interface DayProps {
  day: DayObject;
  isSelected: boolean;
  isCurrentDay: boolean;
  onDateClick: (day: DayObject) => void;
}

const Day: React.FC<DayProps> = ({ day, isSelected, isCurrentDay, onDateClick }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [openEditor, setOpenEditor] = useState(false);

  const userInState = useSelector((state: any) => state.auth.user);
  const community = useSelector((state: any) => state.community.selectedCommunity);

  const handleClick = () => {
    onDateClick(day);
  };

  const handleCreateButtonClick = async (documentName: string) => {
    try {
      if (!community || !userInState) {
        throw new Error('Community or User not found');
      }

      const response = await fetch(`http://localhost:5019/document/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: documentName,
          creatorId: userInState.id,
          calendarId: community.calendar.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDocumentId(data.id);
        console.log('Document successfully created');
      } else {
        console.error('Error creating document');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openDocument = async () => {
    if (!documentId) return;

    try {
      const response = await fetch(`http://localhost:5019/document/get-by-id?documentId=${documentId}`);
      if (response.ok) {
        const data = await response.json();

        const blob = new Blob([data.text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        console.error('Error fetching document');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className={`day ${day.day === 0 ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isCurrentDay ? 'currentDay' : ''}`}
      onClick={handleClick}
    >
      <div className='dayEvents'>
        <label className={`dayLabel ${day.isCurrentMonth ? '' : 'faded'}`}>
          {day.day !== 0 && day.day}        
        </label>
      </div>
      {community && community.name && (
        <button
          className={`addEvent ${day.isCurrentMonth ? '' : 'faded'}`}
          onClick={() => setOpenDialog(true)}
        >
          +
        </button>
      )}

      <DayAddDialog
        open={openDialog}
        onClose={(value) => {
          setSelectedOption(value);
          setOpenDialog(false);
        }}
        onCreateButtonClick={handleCreateButtonClick}
        title="Create a new document"
      />

      {documentId && (
        <button onClick={openDocument}>Open Document</button> 
      )}
      <DocumentEditorDialog
        open={openEditor}
        onClose={() => setOpenEditor(false)}
        onSave={(content, type) => {
          console.log('Document saved:', { content, type });
          setOpenEditor(false);
        }}
      />
    </div>
  );
};

export default Day;
