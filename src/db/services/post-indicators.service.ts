import { Injectable } from '@nestjs/common';
import { PostIndicators } from 'src/db/entities/postIndicators.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostIndicatorsService {
  constructor(
    @InjectRepository(PostIndicators)
    private readonly postRepository: PostIndicators,
  ) {}
}
