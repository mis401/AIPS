import { createSlice } from '@reduxjs/toolkit';

export const communitySlice = createSlice({
  name: 'community',
  initialState: {
    communities: [],
    selectedCommunity: null
  },
  reducers: {
    communityLoadSuccess: (state, action) => {
      state.communities = action.payload;
    },
    communityLoadFailure: (state) => {
      state.communities = []; 
    },
    communitySelectSuccess: (state, action) => {
      state.selectedCommunity = action.payload;
    }
  },
})



export const { communityLoadSuccess, communityLoadFailure, communitySelectSuccess } = communitySlice.actions;
export default communitySlice.reducer;