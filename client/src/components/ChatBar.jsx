import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ChatBar = () => {

  const [activeUsers, setActiveUsers] = useState([]);
  const socket = io('http://localhost:3001');
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);



  useEffect(() => {
    getUser();
    socket.on('activeUsers', (users) => {
      setActiveUsers(users);
      //console.log(activeUsers);
    });

    return () => {
      socket.off('activeUsers');
    };
  }, [userId, token]);

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log('An error occurred while fetching user data:', error);
    }
  };

  //console.log(userId);
  //console.log(activeUsers);
  //console.log(userId);

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {user ? (
            <ul>
              {activeUsers.map((activeUserId) => {
               const activeUser = user;
               //console.log(activeUser)
               return (
                <li key={activeUserId}>{activeUser.firstName} {activeUser.lastName}</li>
              );
               })}
            </ul>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatBar;
