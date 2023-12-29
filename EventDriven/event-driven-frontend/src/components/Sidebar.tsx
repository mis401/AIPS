import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import { User } from '../redux/authTypes';
import SimpleDialog from './SimpleDialog';

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type SidebarProps = PropsFromRedux;

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);

  useEffect(() => {
    if (user !== null) {
      console.log('User prop changed:', user);
    }
  }, [user]);
  
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
          <h3>{user ? `${user.firstName} ${user.lastName}` : 'Guest'}</h3>
          <p>{user ? user.email : 'email@example.com'}</p>
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

export default connector(Sidebar);
