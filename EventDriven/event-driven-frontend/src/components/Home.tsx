import React, { useEffect, useState } from 'react';
import ChatSidebar from "./ChatSidebar";
import '../styles/Home.css';
import Sidebar from "./Sidebar";
import '../styles/Sidebar.css';
import IconsBar from "./Iconbar";
import '../styles/Iconbar.css';
import Calendar from "./Calendar";

function Home() {
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
    const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);

    const toggleChatSidebar = () => {
        setIsChatSidebarOpen(!isChatSidebarOpen);
    }

    const handleDefaultCommunitySet = (defaultCommunityName: string, defaultCommunityId: number) => {
        setSelectedCommunity(defaultCommunityName);
        setSelectedCommunityId(defaultCommunityId);
    }

    const handleCommunitySelect = (communityName: string, communityId: number) => {
        setSelectedCommunity(communityName);
        setSelectedCommunityId(Number(communityId));
    }

    return (
        <div className={`container ${isChatSidebarOpen ? 'chat-sidebar-open' : ''}`}>
           <Sidebar onCommunitySelect={handleCommunitySelect}
                onDefaultCommunitySet={handleDefaultCommunitySet}/>
           {selectedCommunityId !== null && (
               <Calendar communityName={selectedCommunity}
               communityId={selectedCommunityId}/>
           )}
           <IconsBar toggleChatSidebar={toggleChatSidebar} isChatSidebarOpen={isChatSidebarOpen}/>   
           {selectedCommunityId !== null && (
               <ChatSidebar 
                   isChatSidebarOpen={isChatSidebarOpen} 
                   communityId={selectedCommunityId} 
               />
           )}
        </div>
    );
}

export default Home;
