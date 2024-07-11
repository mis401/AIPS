import React, { useEffect, useState } from 'react';
import CommunityDialog from './CommunityDialog';
import useAuth from '../hooks/useAuth';

interface SidebarProps {
  onCommunitySelect: (communityName: string, communityId: number) => void;
  onDefaultCommunitySet: (defaultCommunityName: string, defaultCommunityId : number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCommunitySelect, onDefaultCommunitySet }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<{ name: string, id: number } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [newCommunityName, setNewCommunityName] = useState<string>('');
  const [communityCode, setCommunityCode] = useState<string>('');
  const [communities, setCommunities] = useState<any[]>([]);
  const [isCommunityWindowOpen, setIsCommunityWindowOpen] = useState(false);

  const { auth } = useAuth();
  const userInState = auth?.user;

  useEffect(() => {
    if (userInState !== null) {
      console.log('User prop changed:', userInState);
      const response = fetch(`http://localhost:8000/community/get-for-user?userId=${userInState.id}`, {
        method: `GET`
      });
      response.then(async (value) => {
        if (value.ok) {
          const data = value.json();
          console.log(data);
          data.then((array) => {
            console.log('Communities data:', array)
            setCommunities([...array]);
            if (array.length !== 0) {
              onDefaultCommunitySet(array[0].name, array[0].id);
            }
          });
        }
      });
    }
  }, [userInState]);

  const handleDialogToggle = () => {
    setOpenDialog(prevOpenDialog => !prevOpenDialog);  
    setIsCommunityWindowOpen(prevState => !prevState);
  };

  const handleLeaveDialogToggle = () => {
    setOpenLeaveDialog(!openLeaveDialog);
    setIsCommunityWindowOpen(!openLeaveDialog); // Toggle add community button
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleCreateButtonClick = () => {
    if (selectedOption === 'Create a community') {
      fetch('http://localhost:8000/community/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCommunityName,
          userId: userInState?.id,
        }),
      })
      .then(response => response.json())
      .then(data => {
        setCommunities(prev => [...prev, data]);
        setNewCommunityName('');
        handleDialogToggle();  
      });
    } else if (selectedOption === 'Join a community') {
      console.log("Comm code: ", communityCode);
      fetch('http://localhost:8000/community/join', {
        method: 'PUT',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          communityCode: communityCode,
          userId: userInState?.id,
        }),
      })
      .then(response => response.json())
      .then(data => {
        setCommunities(prev => [...prev, data]);
        setCommunityCode('');
        handleDialogToggle();  
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
    else{
      handleDialogToggle();
    }
  };

  const handleCommunityClick = (communityName: string, communityId: number) => {
    onCommunitySelect(communityName, Number(communityId)); // Ensure communityId is a number
  };

  const handleLeaveCommunity = async () => {
    if (selectedCommunity) {
      await fetch('http://localhost:8000/community/leave', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInState?.id,
          communityId: selectedCommunity.id,
        }),
      });
      setCommunities(prev => prev.filter(community => community.id !== selectedCommunity.id));
      handleLeaveDialogToggle();
    }
  };

  return (
    <aside className="sidebar">
      <div className="profile-section">
        <div className="profile-pic"></div>
        <div className="user-info">
          <h3>{userInState ? `${userInState.firstName} ${userInState.lastName}` : 'Guest'}</h3>
          <p>{userInState ? userInState.email : 'email@example.com'}</p>
        </div>
      </div>
      <div className='scrollable-communities'>
        <div className="communities-section">
          {communities.map((community) => (
            <div key={community.id} className="community-container">
              <div className="community-name" onClick={() => handleCommunityClick(community.name, community.id)}>
                <span>{community.name}</span>
              </div>
              <button className="leave-button" onClick={() => { setSelectedCommunity(community); handleLeaveDialogToggle(); }}>X</button>
            </div>
          ))}
        </div>
      </div>
      <div className={`add-community ${isCommunityWindowOpen ? 'inactive' : 'active'}`}>
        <button onClick={handleDialogToggle}>+</button> 
      </div>
      <CommunityDialog
        open={openDialog}
        onClose={handleDialogToggle}  
        selectedOption={selectedOption}
        onCreateButtonClick={handleCreateButtonClick}
        title="Add a new community"
        options={['Join a community', 'Create a community']}
        buttonText='Done'
        onNewCommunityNameChange={(name) => setNewCommunityName(name)}
        onCommunityCodeChange={(code) => setCommunityCode(code)}
        onOptionChange={handleOptionChange}  
      />  

      {openLeaveDialog && selectedCommunity && (
        <div className="leave-community-dialog">
          <p>Are you sure you want to leave the community {selectedCommunity.name}?</p>
          <button onClick={handleLeaveCommunity}>OK</button>
          <button onClick={handleLeaveDialogToggle}>Cancel</button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
