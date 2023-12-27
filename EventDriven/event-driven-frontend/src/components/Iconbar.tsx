import '../styles/Iconbar.css';
import Forum from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

function IconsBar() {
    return (
        <div className="icons-bar">
            <NotificationsIcon sx={{
                    padding: '15px'
                }}/>
            <Forum />
            <SettingsIcon />
        </div>
    );
}

export default IconsBar;