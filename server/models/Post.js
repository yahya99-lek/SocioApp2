import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: 'String',
            required: true,
        },
        firstName: {
            type: 'String',
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        /* this is gonna be a map so we check if the userId exists in the map 
        if it does the value of boolean gonna be true so if u like it u gonna add
        to the map if not u remove it */
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: {
            type: Array,
            default: [],
        }
    },
    {timestamsps: true}
);
const Post = mongoose.model('Post',postSchema);
export default Post;