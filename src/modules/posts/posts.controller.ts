import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Comment } from './comment.entity';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { CommentPost, CreatePostDTO, LikePost } from './dtos';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post()
  createPost(@Body() post: CreatePostDTO): Promise<PostEntity> {
    return this.postService.createPost(post);
  }

  @Get()
  getPosts(): Promise<PostEntity[]> {
    return this.postService.getPosts();
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postService.getPostById(id);
  }

  @Post(':id/:userId')
  async likePost(@Param() params: LikePost): Promise<PostEntity> {
    return this.postService.likePost(params);
  }

  @Post('/comment')
  async createCommentPost(@Param() params: CommentPost): Promise<Comment> {
    return this.postService.createCommentPost(params);
  }
}
