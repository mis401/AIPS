import { createStore } from 'redux';
import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './authReducer';
import { communitySlice } from './communityReducer';

// const store = createStore(rootReducer);

export default configureStore({
    reducer: {
        auth: authSlice.reducer,
        community: communitySlice.reducer
    },
    devTools: process.env.NODE_ENV !== 'production',
})
