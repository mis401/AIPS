import React, { useState } from 'react';
import { DayObject } from './Calendar';
import '../styles/Day.css';
import DocumentEditorDialog from './DocumentEditorDialog';
import useAuth from '../hooks/useAuth';
import DayAddDialog from './DayAddDialog';
import { DocumentType, NewDocumentDTO } from '../dtos/NewDocument';
import { DiffDTO } from '../dtos/diff.dto';

interface DayProps {
  day: DayObject;
  isSelected: boolean;
  isCurrentDay: boolean;
  onDateClick: (day: DayObject) => void;
  communityId: number;
  onDocumentClick: (documentId: number, documentName: string) => void;
}

const Day: React.FC<DayProps> = ({ day, isSelected, isCurrentDay, onDateClick, communityId, onDocumentClick }) => {
  const [openEditor, setOpenEditor] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<{ id?: number; content: string; type: DocumentType } | null>(null);
  
  const { auth } = useAuth();
  const userInState = auth?.user;

  const handleClick = () => {
    onDateClick(day);
  };
  
  // const handleSaveDocument = async (content: string, type: DocumentType) => {
  //   setOpenAddDialog(true);
  //   setCurrentDocument({ content, type });
  // };

  const handleSaveDocument = async (diffDto: DiffDTO) => {
    console.log(diffDto);
    if (diffDto.docId) {
      // Update existing document
      try {
        const response = await fetch('http://localhost:8000/doc/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(diffDto),
        });
        if (response.ok) {
          console.log('Document updated successfully');
        } else {
          console.error('Failed to update the document');
        }
      } catch (error) {
        console.error('Error updating the document:', error);
      }
    } else {
      // Create new document
      setOpenAddDialog(true);
      setCurrentDocument({ ...currentDocument, content: diffDto.diff, type: diffDto.type });
    }
  };

  const handleCreateDocument = (documentName: string) => {
    if (currentDocument) {
      const formattedDate = new Date(day.year, day.month, day.day + 1).toISOString();
      const newDocument: NewDocumentDTO = {
        name: documentName,
        day: formattedDate,
        createdBy: userInState?.id || 0,
        communityId,
        type: currentDocument.type,
        content: currentDocument.content, // Include content
      };
  
      saveDocument(newDocument);
      setOpenAddDialog(false);
    }
  };

  const saveDocument = async (newDocument: NewDocumentDTO) => {
    console.log(newDocument);

    try {
      const response = await fetch('http://localhost:8000/doc/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocument),
      });
      if (response.ok) {
        console.log('Document saved successfully');
      } else {
        console.error('Failed to save the document');
      }
    } catch (error) {
      console.error('Error saving the document:', error);
    }
  };

  // const updateCurrentDocumentStatus = async (documentName: string | null) => {
  //   console.log(`Updating current document status to: ${documentName}`);
  //   try {
  //     const response = await fetch(`http://localhost:8000/user/currentDocument?id=${userInState?.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ document: documentName }),
  //     });

  //     if (response.ok) {
  //       console.log('Document status updated successfully');
  //     } else {
  //       console.error('Failed to update document status');
  //     }
  //   } catch (error) {
  //     console.error('Error updating document status:', error);
  //   }
  // };

  return (
    <div
      className={`day ${day.day === 0 ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isCurrentDay ? 'currentDay' : ''}`}
      onClick={handleClick}
    >
      <div className='dayEvents'>
        <label className={`dayLabel ${day.isCurrentMonth ? '' : 'faded'}`}>
          {day.day !== 0 && day.day}
        </label>
        <div className="documents">
          {day.documents?.map((doc) => (
            <div key={doc.id} className={`document ${doc.type.toLowerCase()}`} onClick={() => { onDocumentClick(doc.id, doc.name);}}>
              {doc.name}
            </div>
          ))}
        </div>
      </div>

      <button className={`addEvent ${day.isCurrentMonth ? '' : 'faded'}`} onClick={() => setOpenEditor(true)}>
        +
      </button>

      <DocumentEditorDialog
        open={openEditor}
        onClose={() => {
          setOpenEditor(false);
        }}
        onSave={handleSaveDocument}
      />

      <DayAddDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onCreateButtonClick={handleCreateDocument}
        title="Create a new document"
      />
    </div>
  );
};

export default Day;
