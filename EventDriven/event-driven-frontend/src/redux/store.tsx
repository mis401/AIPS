import { createStore } from 'redux';
//import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';
<<<<<<< HEAD
<<<<<<< HEAD
import { authSlice } from './authReducer';
import { communitySlice } from './communityReducer';
=======
import authReducer, { authSlice } from './authReducer';
>>>>>>> origin
=======
import authReducer, { authSlice } from './authReducer';
>>>>>>> main

// const store = createStore(rootReducer);

export default configureStore({
    reducer: {
<<<<<<< HEAD
<<<<<<< HEAD
        auth: authSlice.reducer,
        community: communitySlice.reducer
=======
        auth: authReducer
>>>>>>> origin
=======
        auth: authReducer
>>>>>>> main
    },
    devTools: process.env.NODE_ENV !== 'production',
})
