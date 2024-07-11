import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, ValidationPipe } from '@nestjs/common';
import { DocService } from './doc.service';
import { NewDocumentDTO } from 'src/dtos/new-document.dto';
import { UserService } from 'src/user/user.service';

@Controller('doc')
export class DocController {
    constructor(private DocService: DocService) {
    }
    private readonly userService: UserService
    @Post('open')
  async openDocument(@Body() body: { userId: number, communityId: number, documentName: string }) {
    return this.userService.updateUserStatus(body.userId, 'working', body.documentName);
  }

  @Post('close')
  async closeDocument(@Body() body: { userId: number, communityId: number }) {
    return this.userService.updateUserStatus(body.userId, 'idle');
  }
    @Get('get')
    async getDoc(@Query('id') id: number) {
        const idNum = Number(id);
        if (isNaN(idNum)) {
            throw new BadRequestException('Invalid ID');
        }
        const information =  await this.DocService.getDocumentInformation(idNum);
        const content = await this.DocService.getDocumentContent(idNum);
        return {information, content};
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
