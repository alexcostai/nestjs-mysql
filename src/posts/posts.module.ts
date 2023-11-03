import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { User } from 'src/users/user.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, User]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
