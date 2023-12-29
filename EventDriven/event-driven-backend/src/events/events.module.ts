import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
    controllers: [EventsController],
    providers: [EventsService],
    imports: [],
    exports: [],
})
export class EventsModule {}
