import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from 'src/db/controllers/post.controller';
import { PostService } from 'src/db/services/post.service';
import { Post } from 'src/db/entities/post.entity';
import { User } from 'src/db/entities/user.entity';
import { UserController } from 'src/db/controllers/user.controller';
import { UserService } from 'src/db/services/user.service';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { Group } from './entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Group])],
  controllers: [PostController, UserController, GroupController],
  providers: [PostService, UserService, GroupService],
  exports: [PostService, UserService, GroupService],
})
export class DBModule {}
