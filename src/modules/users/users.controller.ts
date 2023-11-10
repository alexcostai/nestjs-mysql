import { DeleteResult } from 'typeorm';
import { Body, Controller, Delete, Patch, Post, Get } from '@nestjs/common';
import {
  CreateUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
  UserPayloadDTO,
  AuthUserDTO,
  UpdateProfileDTO,
} from './dtos';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthUser, PublicRoute } from 'src/decorators';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @PublicRoute()
  @Post('/login')
  loginUser(@Body() loginValues: LoginUserDTO): Promise<UserPayloadDTO> {
    return this.usersService.loginUser(loginValues);
  }

  @PublicRoute()
  @Post()
  registerUser(@Body() newUser: CreateUserDTO): Promise<UserPayloadDTO> {
    return this.usersService.registerUser(newUser);
  }

  @Get()
  getUser(@AuthUser() user: AuthUserDTO): Promise<User> {
    return this.usersService.getUser(user.sub);
  }

  @Delete()
  deleteUser(@AuthUser() user: AuthUserDTO): Promise<DeleteResult> {
    return this.usersService.deleteUser(user.sub);
  }

  @Patch()
  updateUser(
    @Body() updatedUser: UpdateUserDTO,
    @AuthUser() user: AuthUserDTO,
  ): Promise<User> {
    return this.usersService.updateUser(user.sub, updatedUser);
  }

  @Post('/profile')
  updateProfile(
    @Body() profile: UpdateProfileDTO,
    @AuthUser() user: AuthUserDTO,
  ) {
    return this.usersService.updateProfile(user.sub, profile);
  }
}
