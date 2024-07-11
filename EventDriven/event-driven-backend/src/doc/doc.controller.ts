import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, ValidationPipe } from '@nestjs/common';
import { DocService } from './doc.service';
import { NewDocumentDTO } from 'src/dtos/new-document.dto';
import { FullDocument } from 'src/dtos/document.interface';
import { info } from 'console';
import { UserService } from 'src/user/user.service';



@Controller('doc')
export class DocController {
    constructor(private DocService: DocService) {
        
    }

    @Get('get')
    async getDoc(@Query('id') id: number) {
        const idNum = Number(id);
        if (isNaN(idNum)) {
            throw new BadRequestException('Invalid ID');
        }
        const information =  await this.DocService.getDocumentInformation(idNum);
        const content = await this.DocService.getDocumentContent(idNum);
        const fullDoc: FullDocument = {
            id: information.id,
            name: information.name,
            day: information.day,
            createdById: information.createdById,
            createdAt: information.createdAt,
            updatedAt: information.updatedAt,
            type: information.type,
            calendarId: information.calendarId,
            content
        }
        return fullDoc;
    }
    
    @Get('get-docs-calendar-month')
    async getAllCommunityDocs(@Query('calendarId') calendarId: number, @Query('month') month: number, @Query('year') year: number) {
        const idNum = Number(calendarId);
        const monthNum = Number(month);
        const yearNum = Number(year);
        if (isNaN(idNum) || isNaN(monthNum) || isNaN(yearNum)){
            throw new BadRequestException('Invalid query');
        }
        return await this.DocService.getDocumentsForCalendarMonth(idNum, monthNum, yearNum);
    }
    
    @Post('create')
    async createDocument(@Body() document: NewDocumentDTO){
        return await this.DocService.createDocument(document);
    }

}
