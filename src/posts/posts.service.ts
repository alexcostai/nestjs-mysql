import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { User } from 'src/users/user.entity';
import { LikePost } from 'src/dto/like-post.dto';
import { UsersService } from 'src/users/users.service';
import { CreatePostDTO } from 'src/dto/create-post.dto';
import { log } from 'console';

@Injectable()
export class PostsService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Like) private likeRepository: Repository<Like>,
  ) {}

  async createPost(post: CreatePostDTO): Promise<Post> {
    await this.usersService.findUserById(post.authorId);
    const newPost = this.postRepository.create(post);
    return this.postRepository.save(newPost);
  }

  getPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['author', 'likes'] });
  }

  async getPostById(id: number): Promise<Post> {
    return this.findPostById(id, { author: true, likes: true });
  }

  private async findPostById(
    id: number,
    relations: FindOptionsRelations<Post>,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations,
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async likePost({ id, userId }: LikePost) {
    const post = await this.findPostById(id, { likes: true });
    const user = await this.usersService.findUserById(userId, { likes: true });
    const hasLike = await this.likeRepository.findOne({
      where: { user, post },
    });
    if (hasLike) {
      const newPostLikes = post.likes.filter((like) => like !== hasLike);
      const newUserLikes = user.likes.filter((like) => like !== hasLike);
      post.likes = newPostLikes;
      user.likes = newUserLikes;
      await this.likeRepository.remove(hasLike);
    } else {
      const newLike = this.likeRepository.create({ user, post });
      post.likes.push(newLike);
      user.likes.push(newLike);
      await this.likeRepository.save(newLike);
    }
    this.userRepository.save(user);
    this.postRepository.save(post);
    return post;
  }
}
