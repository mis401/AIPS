import '../styles/Iconbar.css';
import Forum from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import Window from './Window';

function IconsBar() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const openSettingsWindow = () => {
        setIsSettingsOpen(true);
    }

    const closeSettingsWindow = () => { 
        setIsSettingsOpen(false);
    }

    return (
        <div className="icons-bar">
            <NotificationsIcon className='icon' sx={{
                    padding: '15px'
                }}/>
            <Forum className='icon msg' sx={{
                    padding: '15px'
                }} />
            <SettingsIcon className='icon' sx={{
                    padding: '15px',
                    cursor: 'pointer'
                }}
                onClick={openSettingsWindow}/>

            {isSettingsOpen && (
                <Window onClose={closeSettingsWindow}>
                    <p>Log out</p>
                </Window>
            )}

        </div>
    );
}

export default IconsBar;