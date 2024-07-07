import '../styles/Iconbar.css';
import Forum from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState, useRef } from 'react';
import Window from './Window';
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';

function IconsBar({ toggleChatSidebar }: { toggleChatSidebar: () => void }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const settingsIconRef = useRef<HTMLDivElement>(null);

    const openSettingsWindow = () => {
        setIsSettingsOpen(true);
    }

    const closeSettingsWindow = () => {
        setIsSettingsOpen(false);
    }

    const handleSignOut = async () => {
        try {
            const response = await fetch('/auth/signout', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                navigate('/auth');
                logout();
            } else {
                const errorData = await response.json();
                console.error('Signout failed: ', errorData.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const getSettingsWindowTopPosition = () => {
        if (settingsIconRef.current) {
            const rect = settingsIconRef.current.getBoundingClientRect();
            const top = rect.bottom;
            
            return top;
        }
        return 0;
    }

    return (
        <div className="icons-bar">
            <NotificationsIcon className='icon' sx={{ padding: '15px' }} />
            <Forum className='icon msg' sx={{ padding: '15px' }} onClick={toggleChatSidebar} />
            <div ref={settingsIconRef} style={{ display: 'inline-block' }}>
                <SettingsIcon className='icon' sx={{ padding: '15px', cursor: 'pointer' }} onClick={openSettingsWindow} />
            </div>

            {isSettingsOpen && (
                <Window onClose={closeSettingsWindow} top={getSettingsWindowTopPosition()}>
                    <ul className="settings-options">
                        <li onClick={handleSignOut}>Log out</li>
                        {/* Add more options here */}
                        <li>Option 2</li>
                        <li>Option 3</li>
                    </ul>
                </Window>
            )}
        </div>
    );
}

export default IconsBar;
