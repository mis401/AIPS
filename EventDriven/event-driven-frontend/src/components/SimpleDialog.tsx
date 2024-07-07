import React, { useState } from 'react';

<<<<<<< HEAD
export interface SimpleDialogProps {
=======
interface SimpleDialogProps {
>>>>>>> main
  open: boolean;
  onClose: (value: string) => void;
  selectedOption: string | null;
  onCreateButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onJoinButtonClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; 
  onNameChange: (value: string) => void;
  title: string;
  options: string[];
<<<<<<< HEAD
  createButtonText: string;
  joinButtonText: string;
  firstInputLabel: string; 
  secondInputLabel: string;
  firstInputHint: string;
  secondInputHint: string;
}


function SimpleDialog(props: SimpleDialogProps) {
  const {
    onClose,
    selectedValue,
    onNameChange,
    open,
    selectedOption,
    onCreateButtonClick,
    onJoinButtonClick,
    title,
    options,
    createButtonText,
    joinButtonText,
    firstInputLabel,
    secondInputLabel,
    firstInputHint,
    secondInputHint,
  } = props;

  const [firstInputValue, setFirstInputValue] = React.useState('');
  const [secondInputValue, setSecondInputValue] = React.useState('');
=======
  buttonText: string;
  onNewCommunityNameChange: (name: string) => void;
}

const SimpleDialog: React.FC<SimpleDialogProps> = ({
  open,
  onClose,
  selectedOption,
  onCreateButtonClick,
  title,
  options,
  buttonText,
  onNewCommunityNameChange,
}) => {
  const [communityName, setCommunityName] = useState('');
>>>>>>> main

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onClose(event.target.value);
  };

<<<<<<< HEAD
  const handleFirstInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFirstInputValue(value);
    onNameChange(value);
=======
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityName(event.target.value);
    onNewCommunityNameChange(event.target.value);
  };

  const handleSubmit = () => {
    onCreateButtonClick();
>>>>>>> main
  };

  const handleSecondInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSecondInputValue(value);
    onNameChange(value);
  };
  

  return (
<<<<<<< HEAD
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemText primary={firstInputLabel} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="text" value={firstInputValue} onChange={handleFirstInputChange} placeholder={firstInputHint} style={{ width: '100%' }} />
            <div className='createButtonDiv'>
              <Button onClick={onCreateButtonClick}>{createButtonText}</Button>
            </div>
          </div>
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary={secondInputLabel} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="text" value={secondInputValue} onChange={handleSecondInputChange} placeholder={secondInputHint} style={{ width: '100%' }} />
            <div className='joinButtonDiv'>
            <Button onClick={onJoinButtonClick}>{joinButtonText}</Button>

            </div>
          </div>
        </ListItem>
      </List>
    </Dialog>
=======
    open ? (
      <div className="dialog">
        <h2>{title}</h2>
        <select value={selectedOption || ''} onChange={handleOptionChange}>
          <option value="" disabled>Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        {selectedOption === 'Create a community' && (
          <>
            <input
              type="text"
              placeholder="Enter community name"
              value={communityName}
              onChange={handleInputChange}
            />
            <button onClick={handleSubmit}>{buttonText}</button>
          </>
        )}
        {selectedOption === 'Join a community' && (
          <input
            type="text"
            placeholder="Enter community code"
            onChange={handleInputChange}
          />
        )}
      </div>
    ) : null
>>>>>>> main
  );
};

export default SimpleDialog;
