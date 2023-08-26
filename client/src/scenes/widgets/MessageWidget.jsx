import React, {useState} from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import {addMessage} from '../../state';



const MessageForm = () => {
  console.log('Form rendered');
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state)=> state.user._id);

  const [formData,setFormData] = useState({
    senderId: loggedInUserId,
    receiverId: '',
    messageContent: '',
    subject: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form rendered');
    console.log(loggedInUserId);
    console.log(formData);
    const newMessage = {
      senderId: loggedInUserId,
      receiverId: formData.receiverId,
      messageContent: formData.messageContent,
      subject: formData.subject || "No Subject",
    };
    dispatch(addMessage(newMessage));
    setFormData({
      receiverId: '',
      messageContent: '',
      subject: '',
    });
  };
  console.log(loggedInUserId);
  console.log(formData);
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
      label='Receiver ID'
      value={formData.receiverId}
      onChange={(e) => setFormData({...formData, receiverId: e.target.value})}
      required
      />
      <TextField
      label='Subject'
      value={formData.subject}
      onChange={(e) => setFormData({...formData, subject: e.target.value})}
      required
      />
      <TextField
      label='Content'
      value={formData.messageContent}
      onChange={(e) => setFormData({...formData, messageContent: e.target.value})}
      required
      />
      <Button type="submit" variant='contained' color="primary">
        Send Message
      </Button>
    </Box>
  )
}

export default MessageForm