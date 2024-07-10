import { useEffect, useState, useRef } from "react";
import "../styles/ChatSidebar.css";
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';

interface Member {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: 'online' | 'offline'; 
    currentDocument?: string | null;
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

    useEffect(() => {
        fetchMembers();
        fetchMessages();
    }, [communityId]);

    useEffect(() => {
        if (userInState?.id) {
            if (socket.current) {
                socket.current.disconnect();
            }

            socket.current = io('http://localhost:8000', {
                query: { userId: userInState.id.toString(), communityId: communityId.toString() }
            });

            socket.current.on('connect', () => {
                console.log('Socket.io connection established for chat');
            });

            socket.current.on('message', (message: Message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            socket.current.on('userStatus', ({ userId, status, currentDocument }: { userId: string, status: 'online' | 'offline', currentDocument: string | null }) => {
                console.log(`User status update: ${userId} is now ${status} working on ${currentDocument}`);
                setMembers((prevMembers) => {
                    const updatedMembers = prevMembers.map(member => {
                        if (member.id === Number(userId)) {
                            console.log(`Updating member ${member.firstName} ${member.lastName} status to ${status} working on ${currentDocument}`);
                            return { ...member, status, currentDocument };
                        }
                        return member;
                    });
                    console.log('Updated members:', updatedMembers);
                    return updatedMembers;
                });
            });

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }
    }, [userInState, communityId]);

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
                } else {
                    const errorData = await response.json();
                    console.error('Send message failed:', errorData.message);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }

            setNewMessage('');
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
                            {member.status === 'online' && member.currentDocument ? (
                                <span>working on {member.currentDocument}</span>
                            ) : member.status === 'online' ? (
                                <span>idle</span>
                            ) : null}
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
