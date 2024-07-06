import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventDTO } from 'src/dtos/event.dto';

@Controller('events')
export class EventsController {
    constructor(private eventService: EventsService) {}

    @Get('get-all')
    async getAllEvents(@Query() communityId: number) {
        return await this.eventService.getAllEvents(communityId);
    }

    @Post('create')
    async createEvent(@Body('communityId') communityId: number, @Body('event') event: EventDTO){
        return await this.eventService.createEvent(communityId, event);
    }

    @Delete('delete')
    async deleteEvent(@Query('id') id: number) {
        return await this.eventService.deleteEvent(id);
    }

    @Put('update')
    async updateEvent(@Body('event') event: EventDTO) {
        return await this.eventService.updateEvent(event);
    }
}
