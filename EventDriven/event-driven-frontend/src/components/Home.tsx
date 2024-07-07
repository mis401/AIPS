import Calendar from "./Calendar";
import '../styles/Home.css'
import Sidebar from "./Sidebar";
import '../styles/Sidebar.css'
import Iconbar from "./Iconbar";
import '../styles/Iconbar.css'
import ChatSidebar from "./ChatSidebar";
import { useState } from "react";

function Home() {
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

    const toggleChatSidebar = () => {
        setIsChatSidebarOpen(!isChatSidebarOpen);
    }

    const handleCommunitySelect = (communityName: string) => {
        setSelectedCommunity(communityName);
    }

    return (
        <div className="container">
           <Sidebar onCommunitySelect={handleCommunitySelect}/>
           <Calendar communityName={selectedCommunity}/>
           <Iconbar toggleChatSidebar={toggleChatSidebar}/>   
           <ChatSidebar isChatSidebarOpen={isChatSidebarOpen}/>        
        </div>
    );
} 

export default Home;
