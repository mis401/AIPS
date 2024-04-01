import { Module } from '@nestjs/common';
import { DocController } from './doc.controller';
import { DocService } from './doc.service';
import { FilesysService } from 'src/filesys/filesys.service';

@Module({
    controllers: [DocController],
    providers: [DocService, FilesysService],
    imports: [],
    exports: [],
})
export class DocModule {}
