import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import {
  CreateProfileDTO,
  CreateUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
  UserPayloadDTO,
  AuthUserDTO,
} from './dtos';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthUser, PublicRoute } from 'src/decorators';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Post()
  registerUser(@Body() newUser: CreateUserDTO): Promise<UserPayloadDTO> {
    return this.usersService.registerUser(newUser);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.usersService.deleteUser(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedUser: UpdateUserDTO,
  ): Promise<User> {
    return this.usersService.updateUser(id, updatedUser);
  }

  @Post('/profile')
  createProfile(
    @Body() profile: CreateProfileDTO,
    @AuthUser() user: AuthUserDTO,
  ) {
    return this.usersService.createProfile(user.sub, profile);
  }

  @PublicRoute()
  @Post('/login')
  loginUser(@Body() loginValues: LoginUserDTO): Promise<UserPayloadDTO> {
    return this.usersService.loginUser(loginValues);
  }
}
