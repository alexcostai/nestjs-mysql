import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthUser } from 'src/decorators';
import { Comment } from './comment.entity';
import { AuthUserDTO } from '../users/dtos';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { CommentPost, CreatePostDTO } from './dtos';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post()
  createPost(
    @AuthUser() user: AuthUserDTO,
    @Body() post: CreatePostDTO,
  ): Promise<PostEntity> {
    return this.postService.createPost(user.sub, post);
  }

  @Get()
  getPosts(@AuthUser() user: AuthUserDTO): Promise<PostEntity[]> {
    return this.postService.getPosts(user.sub);
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postService.getPostById(id);
  }

  @Post(':id/')
  async likePost(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthUserDTO,
  ): Promise<PostEntity> {
    return this.postService.likePost({ id, userId: user.sub });
  }

  @Post('/comment')
  async createCommentPost(
    @Body() comment: CommentPost,
    @AuthUser() user: AuthUserDTO,
  ): Promise<Comment> {
    return this.postService.createCommentPost(user.sub, comment);
  }
}
