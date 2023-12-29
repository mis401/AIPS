import { Injectable, NotFoundException } from '@nestjs/common';
import { Community, DocumentType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DocService {
    constructor(private prisma: PrismaService) {
        
    }

    async getDoc(id: number){
        try{
            const docId = Number(id);
            if (isNaN(docId)) {
                throw new Error('Invalid doc id')
            }
            const doc = await this.prisma.document.findUnique({
                where: {
                    id: docId
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                }
            });
            if (!doc) {
                throw new NotFoundException('Doc not found')
            }
            return doc;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async createDoc(userId: number, type: DocumentType, name: string, day: Date, communityId: number) {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    id: userId
                }
            })
            const community = await this.prisma.community.findUniqueOrThrow({
                where: {
                    id: communityId
                }
            })
            switch(type) {
                case DocumentType.WHITEBOARD:

            }
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Not found')
            }
            console.log(error)
            throw error;
        }
    }


    async createWhiteboardDoc(name: string, day: Date, community: Community) {
        
    }
}
