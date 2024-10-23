import { Test, TestingModule } from '@nestjs/testing';
import { ReportCommentService } from '../report-comment.service';

describe('ReportCommentService', () => {
  let service: ReportCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportCommentService],
    }).compile();

    service = module.get<ReportCommentService>(ReportCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
