import { Injectable } from '@nestjs/common';
import { Community, User } from '@prisma/client';
import * as fs from 'fs-extra';
import { PrismaService } from 'prisma/prisma.service';
import { NewDocumentDTO } from 'src/dtos/new-document.dto';
import { createCanvas } from 'canvas';

@Injectable()
export class FilesysService {
    private prisma;
    public FilesysService(prisma: PrismaService){
        this.prisma = prisma;
    }

    async generateTextDocument(newDoc: NewDocumentDTO, user: User, community: Community) {
        try {
            let docPath: string = `./files/${community.name}/${newDoc.day}/${newDoc.name}.txt`;
            let duplicate : number = 0;
            let duplicateString: string;
            let found: boolean = await fs.pathExists(docPath);
            while (found) {
                duplicate++;
                duplicateString = ` ${duplicate}`;
                newDoc.name = `${newDoc.name}${duplicateString}`;
                docPath = `./files/${community.name}/${newDoc.day}/${newDoc.name}.txt`;
                found = await fs.pathExists(docPath);
            }
            console.log(newDoc)
            if (!newDoc.content){
                newDoc.content = "";
            }
            await fs.outputFile(docPath, newDoc.content);
            return docPath;
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }

    async generateWhiteboardDocument(newDoc: NewDocumentDTO, user: User, community: Community) {
        try {
            const canvas = createCanvas(1920, 1080);
            const context = canvas.getContext('2d');
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            let docPath: string = `./files/${community.name}/${newDoc.day}/${newDoc.name}.png`;

            let duplicate : number = 0;
            let duplicateString: string;
            let found: boolean = await fs.pathExists(docPath);
            while (found) {
                duplicate++;
                duplicateString = ` ${duplicate}`;
                newDoc.name = `${newDoc.name}${duplicateString}`;
                docPath = `./files/${community.name}/${newDoc.day}/${newDoc.name}.png`;
                found = await fs.pathExists(docPath);
            }
            if (!newDoc.content) {
                newDoc.content = canvas.toDataURL();
            }
            console.log(newDoc.content)
            const base64Data = newDoc.content.replace(/^data:image\/png;base64,/, '');
            await fs.outputFile(docPath, base64Data, 'base64');
            return docPath;
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

    async generateTodoDocument(newDoc: NewDocumentDTO, user: User, community: Community) {
        try {
            let docPath: string = `./files/${community.name}/${newDoc.day}/${newDoc.name}.md`;
            let duplicate : number = 0;
            let duplicateString: string;
            let found: boolean = await fs.pathExists(docPath);
            while (found) {
                duplicate++;
                duplicateString = ` ${duplicate}`;
                newDoc.name = `${newDoc.name}${duplicateString}`;
                docPath = `./files/${community.name}/${newDoc.day}/${newDoc.name}.md`;
                found = await fs.pathExists(docPath);
            }
            if (!newDoc.content){
                newDoc.content = "";
            }
            await fs.outputFile(docPath, newDoc.content);
            return docPath;
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

    async saveDocumentContent(docPath: string, content: string) {
        try {
            if (docPath.endsWith('.png')) {
                // Save base64 image content
                const base64Data = content.replace(/^data:image\/png;base64,/, '');
                await fs.outputFile(docPath, base64Data, 'base64');
            } else {
                // Save text content
                await fs.outputFile(docPath, content);
            }
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }

    async getTextDocument(docPath: string) {
        try {
            const content = await fs.readFile(docPath, 'utf8');
            return content;
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

    async getWhiteboardDocument(docPath: string) {
        try {
            const content: string = await fs.readFile(docPath, 'base64')
            console.log(content)
            return content;
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

    async getTodoDocument(docPath: string) {
        try {
            const content = await fs.readFile(docPath, 'utf8');
            return content;
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

    async deleteDocument(docPath: string) {
        try {
            await fs.remove(docPath);
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }
}
