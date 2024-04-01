import { User } from "./authTypes";

export interface Community{
    id: number;
    calendarId: number;
    name: string;
    code: string;
    creator: User;
}   
  
  export interface CommunityState {
    communities: Community[];
  }
  
  export const COMMUNITY_LOAD_SUCCESS = 'COMMUNITY_LOAD_SUCCESS';
  export const COMMUNITY_LOAD_FAILURE = 'COMMUNITY_LOAD_FAILURE';
  export const COMMUNITY_SELECT_SUCCESS = 'COMMUNITY_SELECT_SUCCESS';
  
  interface CommunityLoadSuccess {
    type: typeof COMMUNITY_LOAD_SUCCESS;
    payload: Community[];
  }
  
  interface CommunityLoadFailure {
    type: typeof COMMUNITY_LOAD_FAILURE;
  }
  interface CommunitySelectSuccess {
    type: typeof COMMUNITY_SELECT_SUCCESS;
  }
  export type CommunityActionTypes = CommunityLoadSuccess | CommunityLoadFailure | CommunitySelectSuccess;
  