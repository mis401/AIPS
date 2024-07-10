import { useEffect, useState, useRef } from "react";
import "../styles/ChatSidebar.css";
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';

interface Member {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface MemberWithStatus extends Member {
    status: 'online' | 'offline';
}

interface Message {
    senderId: number;
    communityId: number;
    content: string;
    senderName: string;
}

const ChatSidebar = ({ isChatSidebarOpen, communityId }: { isChatSidebarOpen: boolean, communityId: number }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [members, setMembers] = useState<MemberWithStatus[]>([]);
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
                    setMembers(data.map((member: Member) => ({
                        ...member,
                        status: 'offline', // default status
                    })));
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
                console.log(communityId);
                const response = await fetch(`http://localhost:8000/message/messages?communityId=${communityId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.map((msg: any) => ({
                        ...msg,
                        senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
                        content: msg.text // Dodaj mapiranje za `content`
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

        // Socket.io za poruke
        if (userInState?.id) {
            socket.current = io('http://localhost:8000', {
                query: { userId: userInState.id.toString() }
            });

            socket.current.on('connect', () => {
                console.log('Socket.io connection established for chat');
            });

            socket.current.on('message', (message: Message) => {
                console.log("Received message from socket:", message);
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, message];
                    console.log("Updated messages:", updatedMessages);
                    return updatedMessages;
                });
            });

            socket.current.on('userStatus', ({ userId, status }: { userId: string, status: 'online' | 'offline' }) => {
                setMembers((prevMembers) => {
                    const updatedMembers = prevMembers.map(member =>
                        member.id === Number(userId) ? { ...member, status } : member
                    );
                    return updatedMembers;
                });
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

            console.log("Sending message:", newMessage);

            // Slanje poruke putem HTTP POST metoda
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
                        </div>
                        <div className="chat-sidebar-chat-info">
                            <span>{member.firstName} {member.lastName}</span>
                            <span className={`status ${member.status}`}>{member.status}</span>
                        </div>
                    </div>
                ))}
                <div className="chat-sidebar-chat">
                    <div className="chat-sidebar-chat-avatar"></div>
                </div>
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
