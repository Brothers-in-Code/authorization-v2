import { Module } from '@nestjs/common';
import { PostController } from 'src/db/controllers/post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from 'src/db/services/post.service';
import { Post } from 'src/db/entities/post.entity';
import { User } from 'src/db/entities/user.entity';
import { UserController } from 'src/db/controllers/user.controller';
import { UserService } from 'src/db/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), TypeOrmModule.forFeature([User])],
  controllers: [PostController, UserController],
  providers: [PostService, UserService],
  exports: [PostService, UserService],
})
export class DBModule {}
