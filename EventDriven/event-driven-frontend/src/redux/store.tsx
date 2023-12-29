import { createStore } from 'redux';
import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './authReducer';

// const store = createStore(rootReducer);

export default configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
})
