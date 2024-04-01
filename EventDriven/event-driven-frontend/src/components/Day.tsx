import React, { useState } from 'react';
import { DayObject } from './Calendar';
import '../styles/Day.css';
import SimpleDialog, { SimpleDialogProps } from './SimpleDialog';
import DayAddDialog from './DayAddDialog';
import { useSelector } from 'react-redux';
import store from '../redux/store';

interface DayProps {
  day: DayObject;
  isSelected: boolean;
  onDateClick: (day: DayObject) => void;
}

const Day: React.FC<DayProps> = ({ day, isSelected, onDateClick }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<number | null>(null);

  const userInState = useSelector((state: any) => state.auth.user);
  const communityInState = useSelector((state: any) => store.getState().community.communities);

  console.log(communityInState);
  const hasCommunityWithNameNull = communityInState.some((community: any) => community.name === null);
  const community = useSelector((state: any) => state.community.selectedCommunity);

  const handleClick = () => {
    onDateClick(day);
  };
  

  const addDocumentClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose: SimpleDialogProps['onClose'] = (value) => {
    setSelectedOption(value);
    
  };

  const handleCreateButtonClick = async (documentName: string) => {
    try {
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
      })

      if (response.ok) {
        var data = await response.json();
        setDocumentId(data.id);
        console.log('Dokument uspesno kreiran');
      } else {
        console.error('Greska prilikom kreiranja dokumenta');
      }
    } catch (error) {
      console.error('Greška:', error);
    }
  };

  const openDocument = async () => {
    try {
      const response = await fetch(`http://localhost:5019/document/get-by-id?documentId=${documentId}`);
      if (response.ok) {
        const data = await response.json();

        const blob = new Blob([data.text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        
      } else {
        console.error('Greška prilikom preuzimanja dokumenta');
      }
    } catch (error) {
      console.error('Greška:', error);
    }
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

       {!hasCommunityWithNameNull && (
      <button
        hidden = {!community || !(community.name)}
        className={`addEvent ${day.isCurrentMonth ? '' : 'faded'}`}
        onClick={addDocumentClick}
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
    </div>
  );
};

export default Day;
