import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class MessageService {
    constructor(private prisma: PrismaService) {}

    async createMessages(data: Prisma.MessageCreateInput) {
        return this.prisma.message.create({
            data,
            include:{
                sender:true,
                community:true,
            },
        });
    }

    async getMessagesByCommunity(communityId: number){
        console.log(`Fetching messages for communityId:` , communityId);
        
        // Provera da li je communityId broj
        if (typeof communityId !== 'number') {
            console.log("Typeof community not a number");
            throw new Error(`Invalid communityId: ${communityId} (not a number)`);
        }
       
        return this.prisma.message.findMany({
            where: {communityId},
            orderBy: {createdAt: 'asc'},
            include:{
                sender:true,
            },

        });
    }
}
