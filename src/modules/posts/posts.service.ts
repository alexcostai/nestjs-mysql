import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { User } from 'src/modules/users/user.entity';
import { CommentPost, CreatePostDTO, LikePost } from './dtos';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async createPost(userId: number, post: CreatePostDTO): Promise<Post> {
    const userFound = await this.usersService.findUserById(userId);
    const newPost = this.postRepository.create(post);
    userFound.posts.push(newPost);
    await this.userRepository.save(userFound);
    return this.postRepository.save(newPost);
  }

  async getPosts(userId: number): Promise<Post[]> {
    const userFound = await this.usersService.findUserById(userId, {
      posts: true,
    });
    return userFound.posts;
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

  async likePost({ id, userId }: LikePost): Promise<Post> {
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

  async createCommentPost(
    userId: number,
    { postId, content }: CommentPost,
  ): Promise<Comment> {
    const post = await this.findPostById(postId, { comments: true });
    const user = await this.usersService.findUserById(userId, {
      comments: true,
    });
    const newComment = this.commentRepository.create({ user, post, content });
    post.comments.push(newComment);
    user.comments.push(newComment);
    this.postRepository.save(post);
    this.userRepository.save(user);
    return this.commentRepository.save(newComment);
  }
}
