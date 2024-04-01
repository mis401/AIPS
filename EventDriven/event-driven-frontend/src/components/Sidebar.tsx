import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
//import { RootState } from '../redux/rootReducer';
import { Link } from 'react-router-dom';
import SimpleDialog, { SimpleDialogProps } from './SimpleDialog';
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../redux/authReducer";
import { useNavigate } from "react-router-dom";
import store from '../redux/store';
import { communityLoadSuccess, communitySelectSuccess } from '../redux/communityReducer';


export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const userInState = useSelector((state: any) => state.auth.user);
  const [communities, setCommunities] = React.useState<any[]>([]);
  const communityInState = useSelector((state: any) => store.getState().community.communities);
  const [selectedValue, setSelectedValue] = useState<string>(""); 
  const [formData, setFormData] = useState({
    name: '',
    userId: userInState.id
});

useEffect(() => {
  const fetchData = async () => {
    if (userInState !== null) {
      console.log('User prop changed:', userInState);
      try {
        const response = await fetch(`http://localhost:8000/community/get-all?userId=${userInState.user.id}`, {
          method: 'GET'
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          dispatch(communityLoadSuccess([...data]));
        } else {
          console.error('Failed to fetch communities:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
  };

  fetchData();
}, [userInState, dispatch]);


  const fetchCalendars = async (communityId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/calendar/get-all?communityID=${communityId}`, {
      method: 'GET',
    });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Failed to fetch calendars:', response.statusText);
      
      }
    } catch (error) {
      console.error('Fetch error:', error);
   
    }
  }


  const addCommunityClick = () => {
    setOpenDialog(true);
  };

  const openCalendar = async (communityId: number, communityName: string) => {
    try {
      const calendars = await fetchCalendars(communityId);
      const communityResp = await fetch(`http://localhost:8000/community/get?id=${communityId}`)
      if (communityResp.ok){
        const community = await communityResp.json();
        console.log(community);
        dispatch(communitySelectSuccess(community));
      }
      navigate(`/calendar/${communityId}/${communityName}`);

      console.log('Calendars:', calendars);
    } catch (error) {
      console.error('Failed to fetch calendars:', error);
    }
  };

  function handleDialogClose(value: string): void {
    setSelectedOption(value);
  }

  const handleCreateButtonClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault(); 
    try {
        const response = await fetch(`http://localhost:8000/community/create`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                userId: formData.userId,
            }),
        });

        console.log(formData.name, formData.userId)
        if(response.ok) {
            setOpenDialog(false);
        } else {
            const errorData = await response.json();

            console.error('Creation failed: ', errorData.message);
        }
    }
    catch (error) {
        console.error('Fetch error:', error);
    }
}

const handleNameChange = (value: string): void => {
  setFormData({ ...formData, name: value }); 
};

const handleJoinButtonClick = async (): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8000/community/join?userId=${userInState.id}&communityCode=${formData.name}`, {
      method: 'PUT',
    });

    if (response.ok) {
      console.log(`User ${userInState.name} ${userInState.surname} joined community with code ${selectedValue}`);
      setOpenDialog(false);
    } else {
      const errorData = await response.json();
      console.error('Join failed: ', errorData.message);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

 
  const dialogProps: SimpleDialogProps = { 
    open: openDialog,
    selectedValue: selectedValue,
    onNameChange: handleNameChange,
    onClose: handleDialogClose,
    selectedOption: selectedOption,
    onCreateButtonClick: handleCreateButtonClick,
    onJoinButtonClick: handleJoinButtonClick,
    title: "Add a new community",
    options: ['Join a community', 'Create a community'],
    createButtonText: "Create",
    joinButtonText: "Join",
    firstInputLabel: " ",
    secondInputLabel: " ",
    firstInputHint: "Create community",
    secondInputHint: "Join community"
  };

  return (
    <aside className="sidebar">
      <div className="profile-section">
        <div className="profile-pic"></div>
        <div className="user-info">
        <h3>{userInState ? `${userInState.user.firstName} ${userInState.user.lastName}` : 'Guest'}</h3>
          <p>{userInState ? userInState.user.email : 'email@example.com'}</p>
        </div>
      </div>
      <div className='scrollable-communities'>
        <div className="communities-section">
          {communityInState.map((community: any) => (
            <div  onClick={() => openCalendar(community.id, community.name)} key={community.id} className="community"> 
              <span>{community.name}</span> 
              <span>{community.code}</span>
          
            </div>
          ))}
        </div>
      </div>
      <div className="add-community" >
        <button onClick={addCommunityClick}>+</button>
      </div>

      <SimpleDialog {...dialogProps} /> {/* Prosledite props objekat SimpleDialog-u */}



    </aside>
  );
};

export default Sidebar;
//export default connector(Sidebar);