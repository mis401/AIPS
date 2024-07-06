import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CommunityService {
    constructor(private prisma: PrismaService) {}

    async getUserCommunities(userId: number) {
        return await this.prisma.user.findMany({
            where: {
                id: userId
            },
            select: {
                communities: {
                    select: {
                        id: true,
                        name: true,
                        members: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            }
                        },
                        createdUser: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            }
                        },
                        // calendar: {
                        //     include: {
                        //         events: {
                        //             select: {
                        //                 id: true,
                        //                 name: true,
                        //                 start: true,
                        //                 end: true,
                        //                 color: true
                        //             }
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
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                    }
                }
            }
        })
    }

    async getCommunity(id: number) {
        try{
            const communityId = Number(id);
            if (isNaN(communityId)) {
                throw new Error('Invalid community id')
            }
            const community = await this.prisma.community.findUnique({
                where: {
                    id: communityId
                },
                include: {
                    members: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    createdUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    calendar: {
                        include: {
                            events: {
                                select: {
                                    id: true,
                                    name: true,
                                    start: true,
                                    end: true,
                                    color: true
                                }
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
                                        }
                                    }
                                }
                                }
                            },
                        }
                    }
                }
            )
            if (!community) {
                throw new NotFoundException('Community not found')
            }
            return community;
        }
        catch (e) {
            console.log(e.message);
            throw e
        }
    }

    async joinCommunity(userId: number, communityId: number) {
        return await this.prisma.community.update({
            where: {
                id: communityId,
            },
            data: {
                members: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }

    async leaveCommunity(userId: number, communityId: number) {
        const community = await this.prisma.community.update({
            where: {
                id: communityId,
            },
            data: {
                members: {
                    disconnect: {
                        id: userId
                    }
                }
            },
            include:{
                members: true
            }
        })
        if (community.members.length === 0) {
            return await this.prisma.community.delete({
                where: {
                    id: communityId
                }
            })
        }
        else
            return community;
    }

    async createCommunity(name: string, userId: number) {
        try{
            const existingCommunity = await this.prisma.community.findUnique({
                where: {
                    name: name
                }
            })
            if (existingCommunity) {
                throw new Error('Community already exists')
            }
            const calendar = await this.prisma.calendar.create({
                data: {
                    name: name,
                },
            })
            return await this.prisma.community.create({
                data: {
                    name: name,
                    createdUser: {
                        connect: {
                            id: userId
                        }
                    },
                    calendar: {
                        connect: {
                            id: calendar.id
                        }
                    },
                    members: {
                        connect: {
                            id: userId
                        }
                    }
                }
            })
        }
        catch (e) {
            console.log(e.message);
            throw new BadRequestException(e.message)
        }
    }
}
