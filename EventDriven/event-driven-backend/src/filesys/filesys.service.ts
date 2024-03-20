import { Injectable } from '@nestjs/common';
import { Community, User } from '@prisma/client';
import * as fs from 'fs-extra';
import { PrismaService } from 'prisma/prisma.service';
import { NewDocumentDTO } from 'src/dtos/new-document.dto';

@Injectable()
export class FilesysService {
    private prisma;
    public FilesysService(prisma: PrismaService){
        this.prisma = prisma;
    }
    async generateTextDocument(newDoc: NewDocumentDTO, user: User, community: Community){
        try{
            let docPath: string = `./files/${community.name}/${newDoc.name}.txt`;
            const found: boolean = await fs.pathExists(docPath);
            if (found){
                newDoc.name = `${newDoc.name} (1)`;
                docPath = `./files/${community.name}/${newDoc.name}.txt`;
            }
            await fs.writeFile(docPath, "");
            return docPath;
        }
        catch(e){
            console.log(e.message);
            return null;
        }
    }
    async generateWhiteboardDocument(newDoc: NewDocumentDTO, user: User, community: Community){
        try{
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            let docPath: string = `./files/${community.name}/${newDoc.name}.png`;
            const found: boolean = await fs.pathExists(docPath);
            if (found){
                newDoc.name = `${newDoc.name} (1)`;
                docPath = `./files/${community.name}/${newDoc.name}.png`;
            }
            const dataUrl = canvas.toDataURL('image/png', 1);
            await fs.writeFile(docPath, dataUrl);
            return docPath;
        }
        catch(e){
            console.log(e.message);
            return null;
        }
    }
    async generateTodoDocument(newDoc: NewDocumentDTO, user: User, community: Community){
        try{
            let docPath: string = `./files/${community.name}/${newDoc.name}.md`;
            const found: boolean = await fs.pathExists(docPath);
            if (found){
                newDoc.name = `${newDoc.name} (1)`;
                docPath = `./files/${community.name}/${newDoc.name}.md`;
            }
            await fs.writeFile(docPath, "");
            return docPath;
        }
        catch(e){
            console.log(e.message);
            return null;
        }
    }

    
}
