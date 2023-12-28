import { Controller, Get, Query } from '@nestjs/common';
import { DocService } from './doc.service';

@Controller('doc')
export class DocController {
    constructor(private DocService: DocService) {
        
    }

    @Get('get')
    async getDoc(@Query('id') id: number) {
        //return await this.DocService.getDoc(id);
    }

}
