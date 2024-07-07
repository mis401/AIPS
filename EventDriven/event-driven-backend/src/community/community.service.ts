import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { JoinCommunityEvent } from 'src/events-mq/join-community-event';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class CommunityService {
    constructor(
        private prisma: PrismaService,
        private readonly eventEmitter:EventEmitter2
    ) {}

    async getUserCommunities(userId: number) {
        const comms = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                communities: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        members: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                        createdUser: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                        // calendar: {
                        //     include: {
                        //         events: {
                        //             select: {
                        //                 id: true,
                        //                 name: true,
                        //                 start: true,
                        //                 end: true,
                        //                 color: true,
                        //             },
                        //         },
                        //         documents: {
                        //             select: {
                        //                 id: true,
                        //                 name: true,
                        //                 day: true,
                        //                 type: true,
                        //                 createdAt: true,
                        //                 updatedAt: true,
                        //                 createdBy: {
                        //                     select: {
                        //                         firstName: true,
                        //                         lastName: true,
                        //                         id: true,
                        //                     },
                        //                 },
                        //             },
                        //         },
                        //     },
                        // },
                    },
                },
            },
        });

        if (!comms) {
            throw new NotFoundException('User not found');
        }

        return comms.communities;
    }

    async getCommunity(id: number) {
        try {
            const communityId = Number(id);
            if (isNaN(communityId)) {
                throw new BadRequestException('Invalid community id');
            }

            const community = await this.prisma.community.findUnique({
                where: {
                    id: communityId,
                },
                include: {
                    members: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    createdUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    calendar: {
                        include: {
                            events: {
                                select: {
                                    id: true,
                                    name: true,
                                    start: true,
                                    end: true,
                                    color: true,
                                },
                            },
                            documents: {
                                select: {
                                    id: true,
                                    name: true,
                                    day: true,
                                    type: true,
                                    createdAt: true,
                                    updatedAt: true,
                                    createdBy: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            id: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!community) {
                throw new NotFoundException('Community not found');
            }

            return community;
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }

    async joinCommunity(userId: number, communityCode: string) {
        console.log('joinCommunity called with:', { userId, communityCode });
    
        if (!communityCode) {
            throw new BadRequestException('Community code must be provided');
        }
    
        const community = await this.prisma.community.findUnique({
            where: {
                code: communityCode,
            }
        });
    
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
    
        if (!community) {
            throw new NotFoundException('Community does not exist');
        }
        if (!user) {
            throw new NotFoundException('User does not exist');
        }
    
        this.eventEmitter.emit('community.join', new JoinCommunityEvent(
            community.id.toString(),
            community.name,
            userId.toString(),
            user.firstName,
            user.lastName,
        ));
    
        try {
            return await this.prisma.community.update({
                where: {
                    code: communityCode,
                },
                data: {
                    members: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });
        } catch (error) {
            console.error('Error updating community:', error);
        }
    }
    

    async leaveCommunity(userId: number, communityId: number) {
        const community = await this.prisma.community.update({
            where: {
                id: communityId,
            },
            data: {
                members: {
                    disconnect: {
                        id: userId,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        if (community.members.length === 0) {
            return await this.prisma.community.delete({
                where: {
                    id: communityId,
                },
            });
        } else {
            return community;
        }
    }

    async createCommunity(name: string, userId: number) {
        try {
            const existingCommunity = await this.prisma.community.findUnique({
                where: {
                    name: name,
                },
            });

            if (existingCommunity) {
                throw new BadRequestException('Community already exists');
            }

            const calendar = await this.prisma.calendar.create({
                data: {
                    name: name,
                },
            });

            let generatedCode: string = uuidv4();
            generatedCode = generatedCode.slice(0, 7);

            return await this.prisma.community.create({
                data: {
                    name: name,
                    createdUser: {
                        connect: {
                            id: userId,
                        },
                    },
                    calendar: {
                        connect: {
                            id: calendar.id,
                        },
                    },
                    members: {
                        connect: {
                            id: userId,
                        },
                    },
                    code: generatedCode,
                },
            });
        } catch (e) {
            console.log(e.message);
            throw new BadRequestException(e.message);
        }
    }
}
