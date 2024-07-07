import { createSlice } from '@reduxjs/toolkit';
//import { AuthActionTypes, AuthState, LOGIN_SUCCESS, LOGOUT } from './authTypes';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
<<<<<<< HEAD
<<<<<<< HEAD
      state.user = action.payload;
=======
=======
>>>>>>> main
      console.log(state.user)
      console.log(action.payload)
      state.user = action.payload;
      console.log(state.user)
<<<<<<< HEAD
>>>>>>> origin
=======
>>>>>>> main
    },
    logout: (state) => {
      state.user = null;
    },
  },
})


export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
// const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
//   switch (action.type) {
//     case LOGIN_SUCCESS:
//       console.log('Payload received:', action.payload);
//       return {
//         ...state,
//         user: action.payload,
//       };
//     case LOGOUT:
//       return {
//         ...state,
//         user: null,
//       };
//     default:
//       return state;
//   }
// };

// export default authReducer;
