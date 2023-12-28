import React from 'react';
import '../styles/Sidebar.css'; 

const Sidebar = () => {
  const communities = [
    { id: 1, name: 'Community 1' },
    { id: 2, name: 'Community 2' },
  ]; /*dok ne vezemo sa back */

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
      <div className="add-community">
        <button>+</button>
      </div>
    </aside>
  );
};

export default Sidebar;
