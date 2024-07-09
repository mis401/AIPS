import { Injectable, Logger, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JoinCommunityEvent } from 'src/events-mq/join-community-event';
import { NotificationsGateway } from './notification.gateway';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationsListenerService {
  private readonly logger = new Logger(NotificationsListenerService.name);

  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @OnEvent('community.join')
  async handleJoinCommunityEvent(event: JoinCommunityEvent) {
    this.logger.log(`User ${event.firstName} joined community ${event.communityName}`);

    const notification = {
      communityId: event.communityID,
      message: `${event.firstName} ${event.lastName} se pridružio/la zajednici ${event.communityName}!`,
    };

    this.client.emit('notification', notification);
    this.notificationsGateway.sendNotification(notification);
  }
}
