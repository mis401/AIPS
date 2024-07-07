import React, { useState, useEffect } from 'react';

interface CommunityDialogProps {
  open: boolean;
  onClose: () => void;
  selectedOption: string | null;
  onCreateButtonClick: () => void;
  title: string;
  options: string[];
  buttonText: string;
  onNewCommunityNameChange: (name: string) => void;
  onCommunityCodeChange: (code: string) => void;
  onOptionChange: (option: string) => void;
}

const CommunityDialog: React.FC<CommunityDialogProps> = ({
  open,
  onClose,
  selectedOption,
  onCreateButtonClick,
  title,
  options,
  buttonText,
  onNewCommunityNameChange,
  onCommunityCodeChange,
  onOptionChange,
}) => {
  const [communityName, setCommunityName] = useState('');
  const [communityCode, setCommunityCode] = useState('');

  useEffect(() => {
    if (selectedOption === 'Create a community') {
      setCommunityCode('');
    } else if (selectedOption === 'Join a community') {
      setCommunityName('');
    }
  }, [selectedOption]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOption = event.target.value;
    onOptionChange(newOption);  // Call the prop function to update the selected option
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedOption === 'Create a community') {
      setCommunityName(event.target.value);
      onNewCommunityNameChange(event.target.value);
    } else if (selectedOption === 'Join a community') {
      setCommunityCode(event.target.value);
      onCommunityCodeChange(event.target.value);
    }
  };

  const handleSubmit = () => {
    onCreateButtonClick();
  };

  if (!open) return null;

  return (
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
          <p>Enter a name for the new community.</p>
        </>
      )}
      {selectedOption === 'Join a community' && (
        <>
          <input
            type="text"
            placeholder="Enter community code"
            value={communityCode}
            onChange={handleInputChange}
          />
          <p>Enter the code for the community you want to join.</p>
        </>
      )}
      <button onClick={handleSubmit}>{buttonText}</button>
    </div>
  );
};

export default CommunityDialog;
