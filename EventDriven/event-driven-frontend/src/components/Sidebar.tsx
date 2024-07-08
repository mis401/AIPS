import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CommunityDialog from './CommunityDialog';
import useAuth from '../hooks/useAuth';

interface SidebarProps {
  onCommunitySelect: (communityName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCommunitySelect }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [newCommunityName, setNewCommunityName] = useState<string>('');
  const [communityCode, setCommunityCode] = useState<string>('');
  const [communities, setCommunities] = useState<any[]>([]);
  const [isCommunityWindowOpen, setIsCommunityWindowOpen] = useState(false);

  //zamena za redux, za sada privremena
  // const userInState = useSelector((state: any) => state.auth.user);
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
          });
        }
      });
    }
  }, [userInState]);

  const handleDialogToggle = () => {
    setOpenDialog(prevOpenDialog => !prevOpenDialog);  
    setIsCommunityWindowOpen(prevState => !prevState);
  };

  function handleOptionChange(option: string) {
    setSelectedOption(option);
  }

  function handleCreateButtonClick() {
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

  }

  const handleCommunityClick = (communityName: string) => {
    onCommunitySelect(communityName);
  }

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
            <div key={community.id} className="community" onClick={() => handleCommunityClick(community.name)}>
              <span>{community.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`add-community ${isCommunityWindowOpen ? 'inactive' : 'active'}`}>
        <button onClick={handleDialogToggle}>+</button> 
      </div>

      {/* <div className={`${isCommunityWindowOpen ? 'active' : 'inactive'}`}> */}
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
      {/* </div> */}
    </aside>
  );
};

export default Sidebar;