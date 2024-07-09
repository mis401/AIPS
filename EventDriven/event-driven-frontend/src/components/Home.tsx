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
        console.log("toggleChatSidebar called");
        setIsChatSidebarOpen(!isChatSidebarOpen);
        console.log("isChatSidebarOpen:", !isChatSidebarOpen);
    }

    const handleCommunitySelect = (communityName: string, communityId: number) => {
        setSelectedCommunity(communityName);
        setSelectedCommunityId(Number(communityId));
        console.log("CommunityID:", communityId);
    }

    return (
        <div className="container">
           <Sidebar onCommunitySelect={handleCommunitySelect}/>
           <Calendar communityName={selectedCommunity}/>
           <IconsBar toggleChatSidebar={toggleChatSidebar}/>   
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
