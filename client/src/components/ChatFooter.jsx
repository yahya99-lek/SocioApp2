import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const ChatFooter = ({friendId, loggedInUserId}) => {

    const [message, setMessage] = useState('');
    const token = useSelector((state) => state.token);
    const socket = io('http://localhost:3001');

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const messageData = {
          senderId: loggedInUserId,
          receiverId: friendId,
          messageContent: message,
        };
      
        console.log('Sending message:', messageData);
        socket.emit('message', messageData);

       
   
       try{
         
         const response = await fetch('http://localhost:3001/messages/create', {
           method:'POST',
           headers:{
             'Content-Type':'application/json',
             'Authorization': `Bearer ${token}`,
           },
           body: JSON.stringify(messageData)
         });
         const data = await response.json();
         console.log('Message sent', data);
   
       }catch (error){
         console.log('Error sending message:', error);
       }
   
       setMessage('');
     };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendBtn" type="submit">
            SEND
        </button>
      </form>
    </div>
  );
}

export default ChatFooter