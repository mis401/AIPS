import React, { useState } from 'react';
import '../styles/Sidebar.css'; 
import SimpleDialog from './SimpleDialog';

const Sidebar = () => {
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const communities = [
    { id: 1, name: 'Community 1' },
    { id: 2, name: 'Community 2' },
  ]; /*dok ne vezemo sa back */

  const addCommunityClick = () => {
    setOpenDialog(true);
  };

  function handleDialogClose(value: string): void {
    setSelectedOption(value);

  }

  function handleCreateButtonClick(): void {
    setOpenDialog(false);
  }

  return (
    <aside className="sidebar">
      <div className="profile-section">
        <div className="profile-pic"></div>
        <div className="user-info">
          <h3>Ime Prezime</h3>
          <p>email@example.com</p>
        </div>
      </div>
      <div className='scrollable-communities'>
        <div className="communities-section">
          {communities.map((community) => (
            <div key={community.id} className="community">
              <span>{community.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="add-community" >
        <button onClick={addCommunityClick}>+</button>
      </div>

      <SimpleDialog
        selectedValue=""
        open={openDialog}
        onClose={handleDialogClose}
        selectedOption={selectedOption}
        onCreateButtonClick={handleCreateButtonClick}
        title="Add a new community"
        options={['Join a community', 'Create a community']}
        buttonText='Done'
      />
      
    </aside>
  );
};

export default Sidebar;
