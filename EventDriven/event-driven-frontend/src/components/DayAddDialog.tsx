// DayAddDialog.tsx

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DocumentType } from '../dtos/NewDocument';

interface DayAddDialogProps {
  open: boolean;
  onClose: (value: string | null) => void;
  onCreateButtonClick: (documentName: string) => void;
  title: string;
  content?: string; // Add content prop
  type?: DocumentType;
}

const DayAddDialog: React.FC<DayAddDialogProps> = ({ open, onClose, onCreateButtonClick, title }) => {
  const [documentName, setDocumentName] = useState('');

  const handleClose = () => {
    onClose(null);
    setDocumentName('');
  };

  const handleCreateButtonClick = () => {
    onCreateButtonClick(documentName);
    onClose(documentName);
    setDocumentName('');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <div style={{ padding: '20px' }}>
        <div className='dialog-header'>
          <h2>{title}</h2>
          <Button onClick={handleClose}>x</Button>
        </div>
        <TextField
          label="Document Name"
          variant="outlined"
          fullWidth
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleCreateButtonClick} style={{ marginTop: '20px' }}>
          Create Document
        </Button>
      </div>
    </Dialog>
  );
};

export default DayAddDialog;
