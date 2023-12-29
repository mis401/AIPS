import { HttpStatus, Injectable, Request } from '@nestjs/common';
import { Http2ServerResponse } from 'http2';
import { PrismaService } from 'prisma/prisma.service';
import { EventDTO } from 'src/dtos/event.dto';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) {}

    async getAllEvents(community: number) {
        try{
            const communityId = Number(community);
            if (isNaN(communityId)) {
                throw new Error('Invalid community id');
            }
            const events = await this.prisma.event.findMany({
                where: {
                    calendar: {
                        community: {
                            id: communityId
                        }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    start: true,
                    end: true,
                    color: true,
                    calendar: {
                        select: {
                            community: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                }
            });
            return events;
        }
        catch(err) {
            throw err;
        }
    } 

    async createEvent(userId: number, event: EventDTO){
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
        });
        if(!user) {
            throw new Error('User not found');
        }

        const eventDB = await this.prisma.event.create({
            data: {
                name: event.name,
                start: event.start,
                end: event.end,
                color: event.color,
                calendar: {
                    connect: {
                        id: event.calendarId
                    }
                }
            }
        });
    }

    async updateEvent(event: EventDTO){
        try{
            return await this.prisma.event.update({
                where: {
                    id: event.id
                },
                data: {
                    id: event.id,
                    name: event.name,
                    start: event.start,
                    end: event.end,
                    color: event.color,
                }
            });
        }
        catch(e) {
            throw e;
        }
    }

    async deleteEvent(id: number){
        try{
            const eventId = Number(id);
            if (isNaN(eventId)) {
                throw new Error('Invalid event id');
            }
            const event = await this.prisma.event.findUnique({
                where: {
                    id: eventId
                }
            });
            if (!event) {
                throw new Error('Event not found');
            }
            await this.prisma.event.delete({
                where: {
                    id: eventId
                }
            });
            return HttpStatus.OK;
        }
        catch(e) {
            throw e;
        }
    }
}
