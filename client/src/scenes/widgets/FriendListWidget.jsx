import { Box,Typography,useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({userId}) => {
    const dispatch = useDispatch();
    const {palette} = useTheme();
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends);

    
    // 
    const getFriends = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/users/${userId}/friends`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
              dispatch(setFriends({ friends: data }));
            } else {
              console.log("Invalid friends data:", data);
            }
          } else {
            throw new Error("Failed to fetch friends");
          }
        } catch (error) {
          console.log("An error occurred:", error);
        }
      };
      
    
      useEffect(() => {
        getFriends();
      }, []); // eslint-disable-line react-hooks/exhaustive-deps
      

  return (
    <div style={{ width: '600px' }}>
    <WidgetWrapper>
        <Typography 
            color={palette.neutral.dark}
            variant="h5"
            fontWeight="500"
            sx={{ mb:  "1.5rem"}}    
        >
            Friend list
        </Typography>
        {friends.length > 0 ? (
            <Box display="flex" flexDirection="column" gap="1.5rem">
              {friends.map((friend) => (
                <Friend
                  key={friend._id}
                  friendId={friend._id}
                  name={`${friend.firstName} ${friend.lastName}`}
                  subtitle={friend.occupation}
                  userPicturePath={friend.picturePath}
                />
              ))}
            </Box>
          ) : (
            <p>No friends found.</p>
          )}

    </WidgetWrapper>
    </div>
  );
}

export default FriendListWidget