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
            let docPath: string = `./files/${community.name}/${newDoc.name}.txt`;
            const found: boolean = await fs.pathExists(docPath);
            if (found) {
                newDoc.name = `${newDoc.name} (1)`;
                docPath = `./files/${community.name}/${newDoc.name}.txt`;
            }
            await fs.outputFile(docPath, "");
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
            let docPath: string = `./files/${community.name}/${newDoc.name}.png`;
            const found: boolean = await fs.pathExists(docPath);

            if (found) {
                newDoc.name = `${newDoc.name} (1)`;
                docPath = `./files/${community.name}/${newDoc.name}.png`;
            }
            
            await fs.outputFile(docPath, canvas.toBuffer('image/png'));
            return docPath;
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

    async generateTodoDocument(newDoc: NewDocumentDTO, user: User, community: Community) {
        try {
            let docPath: string = `./files/${community.name}/${newDoc.name}.md`;
            const found: boolean = await fs.pathExists(docPath);
            if (found) {
                newDoc.name = `${newDoc.name} (1)`;
                docPath = `./files/${community.name}/${newDoc.name}.md`;
            }
            await fs.outputFile(docPath, "");
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
                await fs.writeFile(docPath, base64Data, 'base64');
            } else {
                // Save text content
                await fs.writeFile(docPath, content);
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
            const content: File = await fs.readFile(docPath, 'utf8')
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
}
