import { createStore } from 'redux';
//import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';
<<<<<<< HEAD
import { authSlice } from './authReducer';
import { communitySlice } from './communityReducer';
=======
import authReducer, { authSlice } from './authReducer';
>>>>>>> origin

// const store = createStore(rootReducer);

export default configureStore({
    reducer: {
<<<<<<< HEAD
        auth: authSlice.reducer,
        community: communitySlice.reducer
=======
        auth: authReducer
>>>>>>> origin
    },
    devTools: process.env.NODE_ENV !== 'production',
})
