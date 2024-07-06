import { Test, TestingModule } from '@nestjs/testing';
import { FilesysService } from './filesys.service';

describe('FilesysService', () => {
  let service: FilesysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesysService],
    }).compile();

    service = module.get<FilesysService>(FilesysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
