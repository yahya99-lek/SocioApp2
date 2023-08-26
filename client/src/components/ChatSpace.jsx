

import React,{useState,useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import MessageSoc from '../components/MessageSoc';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client'
import ChatBar from './ChatBar';
import ChatFooter from './ChatFooter';
import './ChatCss.css';

const ChatSpace = ({socket}) => {
  const { userId } = useParams(); // Get the friend's userId from the URL
  const loggedInUserId = useSelector((state) => state.user._id);
  const [messages,setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const lastMessageRef = useRef(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
 
   
  return (
    <div className="chat">
      <ChatBar socket={socket}/>
      <div className="chat__main">
      <h2>Chat with User: {userId}</h2>
      <MessageSoc messages={messages} friendId={userId} loggedInUserId={loggedInUserId} lastMessageRef={lastMessageRef}/>
      <ChatFooter  friendId={userId} loggedInUserId={loggedInUserId} socket={socket} />
      </div>
    </div>
  );
};

export default ChatSpace;
