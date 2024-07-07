import React, { useState } from 'react';

interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  selectedOption: string | null;
  onCreateButtonClick: () => void;
  title: string;
  options: string[];
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

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onClose(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityName(event.target.value);
    onNewCommunityNameChange(event.target.value);
  };

  const handleSubmit = () => {
    onCreateButtonClick();
  };

  return (
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
  );
};

export default SimpleDialog;
