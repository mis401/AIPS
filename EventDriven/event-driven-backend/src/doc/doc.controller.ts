import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DocService } from './doc.service';
import { NewDocumentDTO } from 'src/dtos/new-document.dto';

@Controller('doc')
export class DocController {
    constructor(private DocService: DocService) {
        
    }

    @Get('get')
    async getDoc(@Query('id') id: number) {
        return await this.DocService.getDoc(id);
    }
    
    @Post('create')
    async createDocument(@Body('doc') doc: NewDocumentDTO){
        return await this.DocService.createDocument(doc);
    }

}
