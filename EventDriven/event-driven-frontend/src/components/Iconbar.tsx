import '../styles/Iconbar.css';
import Forum from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

function IconsBar() {
    return (
        <div className="icons-bar">
            <NotificationsIcon className='icon' sx={{
                    padding: '15px'
                }}/>
            <Forum className='icon msg' sx={{
                    padding: '15px'
                }} />
            <SettingsIcon className='icon' sx={{
                    padding: '15px'
                }}/>
        </div>
    );
}

export default IconsBar;