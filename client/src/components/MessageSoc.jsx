// Chat.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const Chat = ({  friendId, loggedInUserId,lastMessageRef }) => {
  // const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = io('http://localhost:3001');
 
  const {userId} = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);


  const handleLeaveChat = () => {
    localStorage.removeItem('userName');
    navigate(`/profile/${userId}`);
    if (localStorage.getItem('userName') === null) {
      console.log('userName has been removed from localStorage');
    } else {
      console.log('Failed to remove userName from localStorage');
    }
    window.location.reload();
  }

  
  useEffect(() => {
    // Join the room based on the loggedInUser
    socket.emit('join', { userId: loggedInUserId, userName: localStorage.getItem('userName') });

    // Listen for incoming messages
    const handleIncomingMessage = (message) => {
      console.log('Incoming message:', message);
      setMessages((prevMessages) => [...prevMessages, message]); // Add the new message to the existing messages
    };
    socket.on('message', handleIncomingMessage);
    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('message', handleIncomingMessage);
      socket.emit('leave',{userId: loggedInUserId, userName: localStorage.getItem('userName')});
    };
  }, [socket, loggedInUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try{
        const response = await fetch(`http://localhost:3001/messages/${loggedInUserId}/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include your authentication token
          },
        });        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        setMessages(data);
        //console.log(data);
      }catch(error){
        console.log('An error occured while fetching messages', error);
      }
    };
    fetchMessages();
  }, [loggedInUserId, userId]);

  

  return (
    <div>
    <header className="chat__mainHeader">
      <p>Hangout with Colleagues</p>
      <button className="leaveChat__btn" onClick={handleLeaveChat}>
        LEAVE CHAT
      </button>
    </header>

    {/* This shows messages sent from you */}
    <div className="message__container">
    {messages.map((message) => (
      
          <div
          className={`message__chats ${
            message.senderId === loggedInUserId ? 'sent' : 'received'
          }`}
          key={message._id}
        >
          <p className="sender__name">
            {message.senderId === loggedInUserId ? 'You' : 'Friend'}
          </p>
          <div
            className={`message__${message.senderId === loggedInUserId ? 'sender' : 'recipient'}`}
          >
            <p>{message.messageContent}</p>
          </div>
        </div>
  
      ))}
    
        

      {/* This is triggered when a user is typing */}
      <div className="message__status">
      
        <p>Someone is typing...</p>
      </div>
    </div>

    {/* Render the chat messages */}
    {/* {messages.map((msg, index) => (
      <div key={index}>
        {msg.senderId}: {msg.content}
      </div>
    ))} */}
    <div ref={lastMessageRef}/>
  </div>
);
};

export default Chat;
