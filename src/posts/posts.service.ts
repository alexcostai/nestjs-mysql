import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersService } from 'src/users/users.service';
import { CreatePostDTO } from 'src/dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async createPost(post: CreatePostDTO): Promise<Post> {
    await this.usersService.findUserById(post.authorId);
    const newPost = this.postRepository.create(post);
    return this.postRepository.save(newPost);
  }

  getPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['author'] });
  }
}
