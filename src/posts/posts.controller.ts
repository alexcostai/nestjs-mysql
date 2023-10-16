import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDTO } from 'src/dto/create-post.dto';

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
}
