import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Community, DocumentType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { NewDocumentDTO } from 'src/dtos/new-document.dto';
import { FilesysService } from 'src/filesys/filesys.service';

const fs = require('node:fs');
@Injectable()
export class DocService {
    constructor(private prisma: PrismaService, private filesys: FilesysService) {}

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

    async createDocument(newDoc: NewDocumentDTO) {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    id: newDoc.createdBy
                }
            })
            const community = await this.prisma.community.findUniqueOrThrow({
                where: {
                    id: newDoc.communityId
                }
            })
            const path: string = `/${community.name}/${newDoc.name}`;
            let documentPath = null;
            switch(newDoc.type) {
                case DocumentType.DOCUMENT:
                    documentPath = this.filesys.generateTextDocument(newDoc, user, community);
                    break;
                case DocumentType.WHITEBOARD:
                    documentPath = this.filesys.generateWhiteboardDocument(newDoc, user, community);
                    break;
                case DocumentType.TODO:
                    documentPath = this.filesys.generateTodoDocument(newDoc, user, community);
                    break;
            }
            if (!documentPath) {
                throw new Error('Document creation failed')
            }
            const doc = await this.prisma.document.create({
                data: {
                    name: newDoc.name,
                    day: newDoc.day,
                    createdBy: {
                        connect: {
                            id: newDoc.createdBy
                        }
                    },
                    calendar: {
                        connect: {
                            id: community.calendarId
                        }
                    },
                    type: newDoc.type,
                    path: documentPath
                }
            })
            return doc;
        } catch (error) {
            return new InternalServerErrorException(error.message);
        }
    }

    async getDocument(id: number) {
        try {
            const doc = await this.prisma.document.findUnique({
                where: {
                    id: id
                }
            })
            if (!doc) {
                throw new NotFoundException('Document not found')
            }
            return doc;
        }
        catch(e){
            console.log(e.message);
            throw e;
        }
    }

    async getDocumentsForCalendarMonth(calendarId: number, month: number, year: number) {
        try {
            const start = new Date(year, month, 1, 0, 0, 0);
            const end = new Date(year, month + 1, 0, 23, 59, 59);
            const docs = await this.prisma.document.findMany({
                where: {
                    day: {
                        gte: start,
                        lt: end
                    },
                    calendarId: calendarId
                },
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
                    },
                    calendarId: true
                }
            })
            
        }
        catch(e){
            console.log(e.message);
            throw e;
        }
    }
}
