import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Like } from 'src/modules/posts/like.entity';
import { UsersController } from './users.controller';
import { Comment } from 'src/modules/posts/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([User, Profile, Like, Comment]),
  ],
  controllers: [UsersController],
  providers: [UsersService, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [UsersService],
})
export class UsersModule {}
