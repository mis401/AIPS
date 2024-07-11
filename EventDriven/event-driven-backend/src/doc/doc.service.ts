import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Community, DocumentType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { NewDocumentDTO } from 'src/dtos/new-document.dto';
import { FilesysService } from 'src/filesys/filesys.service';

@Injectable()
export class DocService {
    constructor(private prisma: PrismaService, private filesys: FilesysService) {}

    async createDocument(newDoc: NewDocumentDTO) {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: { id: newDoc.createdBy }
            });
            const community = await this.prisma.community.findUniqueOrThrow({
                where: { id: newDoc.communityId }
            });
            const path: string = `/${community.name}/${newDoc.name}`;
            let documentPath = null;
            const oldDay = newDoc.day;
            newDoc.day = newDoc.day.slice(0, 9);
            switch(newDoc.type) {
                case DocumentType.DOCUMENT:
                    documentPath = await this.filesys.generateTextDocument(newDoc, user, community);
                    break;
                case DocumentType.WHITEBOARD:
                    documentPath = await this.filesys.generateWhiteboardDocument(newDoc, user, community);
                    break;
                case DocumentType.TODO:
                    documentPath = await this.filesys.generateTodoDocument(newDoc, user, community);
                    break;
            }

            if (documentPath === null) {
                throw new Error('Document creation failed');
            }
            newDoc.day=oldDay;
            const doc = await this.prisma.document.create({
                data: {
                    name: newDoc.name,
                    day: newDoc.day,
                    createdBy: {
                        connect: { id: newDoc.createdBy }
                    },
                    calendar: { 
                        connect: { id: community.calendarId }
                    },
                    type: newDoc.type,
                    path: documentPath
                }
            });

            //await this.filesys.saveDocumentContent(documentPath, newDoc.content);

            return doc;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    

    async getDocumentInformation(id: number) {
        try {
            const doc = await this.prisma.document.findUnique({
                where: { id: id }
            });
            if (!doc) {
                throw new NotFoundException('Document not found');
            }
            return doc;
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }

    async getDocumentContent(id: number) {
        try {
            const doc = await this.prisma.document.findUnique({
                where: { id: id }
            });
            if (!doc) {
                throw new NotFoundException('Document not found');
            }
            let content = null;
            switch(doc.type) {
                case DocumentType.DOCUMENT:
                    content = await this.filesys.getTextDocument(doc.path);
                    break;
                case DocumentType.TODO:
                    content = await this.filesys.getTodoDocument(doc.path);
                    break;
                case DocumentType.WHITEBOARD:
                    content = await this.filesys.getWhiteboardDocument(doc.path);
                    break;
            }
            if (content === null) {
                throw new InternalServerErrorException('Document content cannot be read');
            }
            return content;
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }

    async getDocumentsForCalendarMonth(calendarId: number, month: number, year: number) {
        try {
            console.log(calendarId, month, year);
            const start = new Date(year, month - 1, 1, 0, 0, 0);
            const end = new Date(year, month - 1, 31, 23, 59, 59);
            console.log(start);
            console.log(end);
            const docs = await this.prisma.document.findMany({
                where: {
                    day: {
                        gte: start,
                        lte: end
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
            });
            return docs;
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }
}
