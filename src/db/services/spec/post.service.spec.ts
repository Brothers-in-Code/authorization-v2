import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { PostService } from '../post.service';
import { Post } from '../../entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupService } from '../group.service';
import { Group } from 'src/db/entities/group.entity';

describe('PostService', () => {
  let service: PostService;
  let repository: Repository<Post>;
  let groupService: GroupService;
  let groupRepository: Repository<Group>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
        GroupService,
        {
          provide: getRepositoryToken(Group),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
    groupService = module.get<GroupService>(GroupService);
    groupRepository = module.get<Repository<Group>>(getRepositoryToken(Group));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
