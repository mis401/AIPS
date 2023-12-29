import '../styles/Iconbar.css';
import Forum from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import Window from './Window';
import { useNavigate } from "react-router-dom";

function IconsBar() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const navigate = useNavigate();

    const openSettingsWindow = () => {
        setIsSettingsOpen(true);
    }

    const closeSettingsWindow = () => { 
        setIsSettingsOpen(false);
    }

    const handleSignOut = async() => {
        try{
            const response = await fetch('auth/signout',{
                method:'GET',
            });

            if(response.ok){
                navigate('/auth');
            } else {
                const errorData = await response.json();

                console.error('Signout failed: ', errorData.message);
            }
        }
        catch (error) {
            console.error('Fetch error:', error);
        }
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
                    <p className="logout" onClick={handleSignOut}>Log out</p>
                </Window>
            )}

        </div>
    );
}

export default IconsBar;