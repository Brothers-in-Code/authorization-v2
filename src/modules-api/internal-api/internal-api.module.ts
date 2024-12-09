import { Module } from '@nestjs/common';
import { InternalApiPostsController } from './internal-api-posts.controller';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [InternalApiPostsController],
})
export class InternalApiModule {}
