import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundError } from 'rxjs';
import { v4 as uuidv4} from 'uuid'

@Injectable()
export class CommunityService {
    constructor(private prisma: PrismaService) {}

    async getUserCommunities(userId: number) {
        const comms = await this.prisma.user.findFirst({
            where: {
                id: userId
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
        return comms.communities;
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

    async joinCommunity(userId: number, communityCode: string) {
        return await this.prisma.community.update({
            where: {
                code: communityCode
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
            let generatedCode: string = uuidv4();
            generatedCode = generatedCode.slice(0, 7);
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
                    },
                    code: generatedCode
                }
            })
        }
        catch (e) {
            console.log(e.message);
            throw new BadRequestException(e.message)
        }
    }
}
