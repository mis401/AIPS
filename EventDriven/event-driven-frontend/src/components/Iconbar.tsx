import '../styles/Iconbar.css';
import Forum from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState, useRef, useEffect } from 'react';
import Window from './Window';
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import { io } from 'socket.io-client';

function IconsBar({ toggleChatSidebar }: { toggleChatSidebar: () => void }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isNotificationWindowOpen, setIsNotificationWindowOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>(() => {
        const savedNotifications = localStorage.getItem('notifications');
        return savedNotifications ? JSON.parse(savedNotifications) : [];
    });
    const navigate = useNavigate();
    const { logout } = useAuth();
    const settingsIconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const socket = io('http://localhost:8000');

        socket.on('connect', () => {
            console.log('Socket.io connection established');
        });

        socket.on('notification', (notification) => {
            console.log('Received notification:', notification);
            setNotifications((prev) => {
                const updatedNotifications = [...prev, notification];
                console.log('Updated notifications:', updatedNotifications);

                localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
                return updatedNotifications;
            });
            setNotificationCount((prev) => prev + 1);
        });

        socket.on('disconnect', () => {
            console.log('Socket.io connection closed');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const openSettingsWindow = () => {
        setIsSettingsOpen(true);
    }

    const closeSettingsWindow = () => {
        setIsSettingsOpen(false);
    }

    const openNotificationWindow = () => {
        setIsNotificationWindowOpen(true);
    }

    const closeNotificationWindow = () => {
        setIsNotificationWindowOpen(false);
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
            <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon
                    className='icon'
                    sx={{ padding: '15px' }}
                    onClick={openNotificationWindow}
                />
            </Badge>
            <Forum
                className='icon msg'
                sx={{ padding: '15px' }}
                onClick={toggleChatSidebar}
            />
            <div ref={settingsIconRef} style={{ display: 'inline-block' }}>
                <SettingsIcon
                    className='icon'
                    sx={{ padding: '15px', cursor: 'pointer' }}
                    onClick={openSettingsWindow}
                />
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

            {isNotificationWindowOpen && (
                <Window onClose={closeNotificationWindow} top={50}>
                    <div className="notification-window">
                        <h3>Notifications</h3>
                        <ul>
                            {notifications.map((notification, index) => (
                                <li key={index}>{notification.message}</li>
                            ))}
                        </ul>
                    </div>
                </Window>
            )}
        </div>
    );
}

export default IconsBar;
