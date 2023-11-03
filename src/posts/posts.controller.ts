import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDTO } from 'src/dto/create-post.dto';
import { LikePost } from 'src/dto/like-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  async likePost(@Param() params: LikePost) {
    return this.postService.likePost(params);
  }
}
