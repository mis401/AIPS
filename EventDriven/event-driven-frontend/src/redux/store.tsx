import { createStore } from 'redux';
//import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { authSlice } from './authReducer';

// const store = createStore(rootReducer);

export default configureStore({
    reducer: {
        auth: authReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
})
