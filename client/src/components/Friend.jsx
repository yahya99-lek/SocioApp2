import React from 'react'
import { PersonAddOutlined,PersonRemoveOutlined } from '@mui/icons-material'
import { Box,IconButton,Typography,useTheme } from '@mui/material';
import { setFriends } from 'state';
import { useDispatch,useSelector } from 'react-redux';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import { useNavigate } from 'react-router-dom';

const Friend = ({friendId, name, subtitle, userPicturePath}) => {
   
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {_id} = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.friends);
    
    const {palette} = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.primary.main;
    const medium = palette.primary.medium;
    // if the user is a friend we'll show an icon to remove the friend
    const isFriend = friends && friends.find((friend) => friend._id === friendId);
    
    const patchFriend = async () => {
        try{
        const response = await fetch(
            `http://localhost:3001/users/${_id}/${friendId}`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            }
            );
            if (!response.ok) {
                console.error('Error response:', response);
                // Handle the error response here
                return;
            }
            const data = await response.json();
            dispatch(setFriends({friends: data}));
        }catch (error){
            console.log("An error has accoured:", error)
        }
    };
    // console.log(friends);
    // console.log(friendId)

  return (
    <FlexBetween>
        <FlexBetween gap="1rem">
            <UserImage image={userPicturePath} size="55px"/>
            <Box 
            onClick={() => {
                navigate(`/profile/${friendId}`);
                navigate(0);
            }}>
                <Typography
                    color={main}
                    variant="h5"
                    fontWeight="500"
                    sx={{
                        "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer"
                        }
                    }}
                >
                    {name}
                </Typography>
                <Typography color={medium} fontSize="0.5rem">
                    {subtitle}
                </Typography>
            </Box>
        </FlexBetween>
        <IconButton
            onClick={() => patchFriend()}
            sx={{
                backgroundColor: primaryLight, p: "0.6rem"
            }}
        >
            {isFriend ? (
                <PersonRemoveOutlined sx={{color: primaryDark}} />
            ) : (
                <PersonAddOutlined sx={{color: primaryDark}}/>
            )}
        </IconButton>
    </FlexBetween>
  )
}

export default Friend