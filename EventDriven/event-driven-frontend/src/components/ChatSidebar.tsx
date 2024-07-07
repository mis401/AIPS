import { useState } from "react";
import "../styles/ChatSidebar.css";

const ChatSidebar = ({isChatSidebarOpen}: {isChatSidebarOpen: boolean}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const openChatSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    }

    return (
        <div className={`chat-sidebar ${isChatSidebarOpen ? '' : 'closed'}`}>
            <div className="chat-sidebar-header">
                <div className="chat-sidebar-title">
                    <h1>Chats</h1>
                </div>
                
            </div>

            <div className="chat-sidebar-chats">
                <div className="chat-sidebar-chat">
                    <div className="chat-sidebar-chat-avatar"></div>
                </div>
            </div>

            <div className="chat-sidebar-footer">
                <div className="chat-sidebar-footer-button" onClick={openChatSearch}>
                    <h1>+</h1>
                </div>

                <div className={`chat-sidebar-search ${isSearchOpen ? '' : 'closed'}`}>
                    <input type="text" placeholder="Search" />
                </div>
            </div>

        </div>
    );
};

export default ChatSidebar;