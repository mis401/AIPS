import { AuthActionTypes, AuthState, LOGIN_SUCCESS, LOGOUT } from './authTypes';

export const initialState: AuthState = {
  user: null,
};

const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log('Payload received:', action.payload);
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;