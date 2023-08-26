import User from "../models/User.js";

// Read
export const getUser = async(req, res) => {
    try {
        const { id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getUserFriends = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
        user.friends.map( (id) => User.findById(id))
    );
        const formattedFriends = friends.map(
        ({_id, firstName, lastName, occupation, location, picturePath}) => {
            return {_id, firstName, lastName, occupation, location, picturePath};
        }
    );
        res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
   
}
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      // If the friendId is part of the user's friend list, remove the friend
      user.friends = user.friends.filter((id) => id !== friendId);
      // Remove the user from the friend's friend list
      friend.friends = friend.friends.filter((id) => id !== req.params.id);
    } else {
      user.friends?.push(friendId);
      friend.friends?.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

