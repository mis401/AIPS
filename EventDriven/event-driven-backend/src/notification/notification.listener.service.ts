import { Injectable, Logger, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JoinCommunityEvent } from 'src/events-mq/join-community-event';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationsListenerService {
  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy,  
  ) {}

  @OnEvent('community.join')
  async handleJoinCommunityEvent(event: JoinCommunityEvent) {
    console.log(`User ${event.firstName} joined community ${event.communityName}`);

    this.client.emit('notification', {
      communityId: event.communityID,
      message: `${event.firstName} ${event.lastName} se pridružio/la zajednici ${event.communityName}!`,
    });
  }
}
