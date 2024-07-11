import { useEffect, useState, useRef } from "react";
import "../styles/ChatSidebar.css";
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';

interface Member {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: 'online' | 'offline'; // Dodato polje za status
}

interface Message {
    senderId: number;
    communityId: number;
    content: string;
    senderName: string;
}

const ChatSidebar = ({ isChatSidebarOpen, communityId }: { isChatSidebarOpen: boolean, communityId: number }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const socket = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { auth } = useAuth();
    const userInState = auth?.user;

    const openChatSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    }

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(`http://localhost:8000/community/${communityId}/members`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setMembers(data);
                    console.log('Fetched members:', data);
                } else {
                    const errorData = await response.json();
                    console.error('Fetch members failed: ', errorData.message);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
    
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8000/message/messages?communityId=${communityId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.map((msg: any) => ({
                        ...msg,
                        senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
                        content: msg.text
                    })));
                    console.log('Fetched messages:', data);
                } else {
                    const errorData = await response.json();
                    console.error('Fetch messages failed: ', errorData.message);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
    
        fetchMembers();
        fetchMessages();
    
        if (userInState?.id) {
            socket.current = io('http://localhost:8000', {
                query: { userId: userInState.id.toString() }
            });
    
            socket.current.on('connect', () => {
                console.log('Socket.io connection established for chat');
            });
    
    
            socket.current.on('userStatus', async ({ userId, status }: { userId: string, status: 'online' | 'offline' }) => {
                console.log(`User status update: ${userId} is now ${status}`);
                // Osveži članove povlačenjem iz baze
                await fetchMembers();
            });
    
            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }
    }, [communityId, userInState]);
    
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    
    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            const message = {
                communityId,
                senderId: userInState?.id,
                message: newMessage,
            };
    
            try {
                const response = await fetch('http://localhost:8000/message/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message),
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log('Message saved:', data);

                    // Dodaj poruku odmah nakon što je poslana
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            senderId: data.senderId,
                            communityId: data.communityId,
                            content: data.text,
                            senderName: `${userInState?.firstName} ${userInState?.lastName}`
                        }
                    ]);
                    setNewMessage('');
                } else {
                    const errorData = await response.json();
                    console.error('Send message failed:', errorData.message);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
    
        }
    };
    
    return (
        <div className={`chat-sidebar ${isChatSidebarOpen ? '' : 'closed'}`}>
            <div className="chat-sidebar-header">
                <div className="chat-sidebar-title">
                    <h1>Chats</h1>
                </div>
            </div>
    
            <div className="chat-sidebar-chats">
                {members.map((member) => (
                    <div key={member.id} className="chat-sidebar-chat">
                        <div className="chat-sidebar-chat-avatar">
                            {/* Možeš dodati sliku avatara ovde */}
                        </div>
                        <div className="chat-sidebar-chat-info">
                            <span>{member.firstName} {member.lastName}</span>
                            <span className={`status ${member.status}`} style={{ color: member.status === 'online' ? 'green' : 'red' }}>
                                {member.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
    
            <div className="chat-sidebar-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.senderId === userInState?.id ? 'my-message' : 'other-message'}`}>
                        <div className="message-sender">{message.senderName}</div>
                        <div className="message-content">{message.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
    
            <div className="chat-sidebar-footer">
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..." 
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatSidebar;
