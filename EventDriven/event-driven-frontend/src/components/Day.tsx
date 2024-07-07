import React, { useState } from 'react';
import { DayObject } from './Calendar';
import '../styles/Day.css';
<<<<<<< HEAD
import SimpleDialog, { SimpleDialogProps } from './SimpleDialog';
import DayAddDialog from './DayAddDialog';
import { useSelector } from 'react-redux';
import store from '../redux/store';
=======
// import SimpleDialog, { SimpleDialogProps } from './SimpleDialog';
import DocumentEditorDialog from './DocumentEditorDialog';
>>>>>>> main

interface DayProps {
  day: DayObject;
  isSelected: boolean;
  isCurrentDay: boolean;
  onDateClick: (day: DayObject) => void;
}

<<<<<<< HEAD
const Day: React.FC<DayProps> = ({ day, isSelected, onDateClick }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<number | null>(null);

  const userInState = useSelector((state: any) => state.auth.user);
  const communityInState = useSelector((state: any) => store.getState().community.communities);

  console.log(communityInState);
  const hasCommunityWithNameNull = communityInState.some((community: any) => community.name === null);
  const community = useSelector((state: any) => state.community.selectedCommunity);
=======
const Day: React.FC<DayProps> = ({ day, isSelected, isCurrentDay, onDateClick }) => {
  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [openEditor, setOpenEditor] = useState(false);

>>>>>>> main

  const handleClick = () => {
    onDateClick(day);
  };
  
<<<<<<< HEAD
=======
    const handleSaveDocument = (content: string, type: string) => {
      console.log('Document saved:', { content, type });
     };
>>>>>>> main

  // const addDocumentClick = () => {
  //   setOpenDialog(true);
  // };

  // const handleDialogClose: SimpleDialogProps['onClose'] = (value) => {
  //   setSelectedOption(value);
  //   setOpenDialog(false);
  // };

<<<<<<< HEAD
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
=======
  // const handleCreateButtonClick = () => {
  //   setOpenDialog(false);
  //   console.log(selectedOption);
  // };
>>>>>>> main

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

<<<<<<< HEAD
       {!hasCommunityWithNameNull && (
      <button
        hidden = {!community || !(community.name)}
        className={`addEvent ${day.isCurrentMonth ? '' : 'faded'}`}
        onClick={addDocumentClick}
      >
=======
      <button className={`addEvent ${day.isCurrentMonth ? '' : 'faded'}`} onClick={() => setOpenEditor(true)}>
>>>>>>> main
        +
      </button>
    )}

<<<<<<< HEAD
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
=======
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
>>>>>>> main
    </div>
  );
};

export default Day;
