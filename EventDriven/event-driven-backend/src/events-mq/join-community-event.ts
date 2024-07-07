export class JoinCommunityEvent{
    constructor(
        public readonly communityID: string,
        public readonly communityName: string,
        public readonly userID: string, 
        public readonly firstName: string, 
        public readonly lastName: string,
    ) {}
}