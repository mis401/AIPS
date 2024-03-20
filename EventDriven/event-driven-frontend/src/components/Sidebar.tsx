import React, { useEffect } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
//import { RootState } from '../redux/rootReducer';
//import { User } from '../redux/authTypes';
import SimpleDialog from './SimpleDialog';

// const mapStateToProps = (state: RootState) => ({
//   user: state.auth.user
// });



//const connector = connect(mapStateToProps);

//type PropsFromRedux = ConnectedProps<typeof connector>;

//type SidebarProps = PropsFromRedux;

export const Sidebar: React.FC = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const userInState = useSelector((state: any) => state.auth.user);
  const [communities, setCommunities] = React.useState<any[]>([]);
  useEffect(() => {
    if (userInState !== null) {
      console.log('User prop changed:', userInState);
      const response = fetch(`http://localhost:8000/community/get-all?${userInState.id}`, {
        method: `GET`
      })
      response.then(async (value) => {
        if (value.ok){
          const data = value.json();
          console.log(data);
          data.then((array) => {
            setCommunities([...array]);
          })
        }
      })
    }
  }, [userInState]);
  
  // const communities: any[] = (async () => {
  //   return await fetch(`http://localhost:8000/community/get-all?userId=${userInState.id}`, {
  //     method: 'GET'
  //   })
  // })()


  const addCommunityClick = () => {
    setOpenDialog(true);
  };

  function handleDialogClose(value: string): void {
    setSelectedOption(value);
  }

  function handleCreateButtonClick(): void {
    setOpenDialog(false);
  }

  async function joinCommunity(){

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
//export default connector(Sidebar);
