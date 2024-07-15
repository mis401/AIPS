export class MessageEvent {
    constructor(
        public readonly communityId: number,
        public readonly senderId: number,
        public readonly message: string,
        public readonly senderName: string,
    ) {}
}