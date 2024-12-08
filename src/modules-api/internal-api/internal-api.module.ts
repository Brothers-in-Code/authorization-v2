import { Module } from '@nestjs/common';
import { InternalApiPostsController } from 'src/modules-api/internal-api/internal-api-posts.controller';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [InternalApiPostsController],
})
export class InternalApiModule {}
