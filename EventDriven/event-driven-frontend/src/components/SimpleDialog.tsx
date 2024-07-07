import React, { useState } from 'react';
import { Dialog, DialogTitle, List, ListItem, ListItemText, Button } from '@mui/material';

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  selectedOption: string | null;
  onCreateButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onJoinButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; 
  onNameChange: (value: string) => void;
  title: string;
  options: string[];
  createButtonText: string;
  joinButtonText: string;
  firstInputLabel: string; 
  secondInputLabel: string;
  firstInputHint: string;
  secondInputHint: string;
}

const SimpleDialog: React.FC<SimpleDialogProps> = ({
  open,
  onClose,
  selectedOption,
  onCreateButtonClick,
  onJoinButtonClick,
  onNameChange,
  title,
  options,
  createButtonText,
  joinButtonText,
  firstInputLabel,
  secondInputLabel,
  firstInputHint,
  secondInputHint,
}) => {
  const [firstInputValue, setFirstInputValue] = useState('');
  const [secondInputValue, setSecondInputValue] = useState('');

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onClose(event.target.value);
  };

  const handleFirstInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFirstInputValue(value);
    onNameChange(value);
  };

  const handleSecondInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSecondInputValue(value);
    onNameChange(value);
  };

  return (
    <Dialog onClose={() => onClose('')} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemText primary={firstInputLabel} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={firstInputValue}
              onChange={handleFirstInputChange}
              placeholder={firstInputHint}
              style={{ width: '100%' }}
            />
            <div className="createButtonDiv">
              <Button onClick={onCreateButtonClick}>{createButtonText}</Button>
            </div>
          </div>
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary={secondInputLabel} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={secondInputValue}
              onChange={handleSecondInputChange}
              placeholder={secondInputHint}
              style={{ width: '100%' }}
            />
            <div className="joinButtonDiv">
              <Button onClick={onJoinButtonClick}>{joinButtonText}</Button>
            </div>
          </div>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default SimpleDialog;
