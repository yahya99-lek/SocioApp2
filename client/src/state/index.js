import {createSlice} from '@reduxjs/toolkit';
// this is for creating a redux slices

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
    messages:[],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    //These reducer functions define how the state should be updated in response to specific actions
    reducers: {
       setMode: (state) => {
        state.mode = state.mode === "light" ? "dark" : "light";
       },
       setLogin: (state,action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
       },
       setLogout: (state, action) => {
        state.user=null;
        state.token = null;
       },
       setFriends: (state, action) => {
        if (state.user) {
          state.user.friends = [...action.payload.friends];
        } else {
          state.user = { friends: [...action.payload.friends] };
        }
      },
       setPosts: (state, action) => {
        state.posts = action.payload.posts;
       },
       setPost: (state, action) => {
        const updatedPosts = state.posts.map((post) => {
            if(post._id  === action.payload.post._id) return action.payload.post;
            return post;
        });
        state.posts = updatedPosts;
       },
       addMessage: (state, action) => {
        state.messages=action.payload;
        state.messages.push(action.payload);
       }

    }
})


export const {setMode,setFriends,setPosts,setPost,setLogin,setLogout, addMessage} = authSlice.actions;
export default authSlice.reducer;