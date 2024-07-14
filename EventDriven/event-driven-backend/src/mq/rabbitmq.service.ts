// rabbitmq.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  public async sendToQueue(queue: string, message: string) {
    try {
      await this.channel.assertQueue(queue);
      this.channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
      console.error('Failed to send message to queue', error);
    }
  }

  public async consume(queue: string, callback: (msg: amqp.Message) => void) {
    try {
      await this.channel.assertQueue(queue);
      this.channel.consume(queue, callback, { noAck: true });
    } catch (error) {
      console.error('Failed to consume messages from queue', error);
    }
  }
}
