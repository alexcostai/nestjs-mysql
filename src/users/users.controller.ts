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
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { CreateProfileDTO } from 'src/dto/create-profile.dto';

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
  createUser(@Body() newUser: CreateUserDTO): Promise<User> {
    return this.usersService.createUser(newUser);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.usersService.deleteUser(id);
  }

  @Patch(':id')
  updateUSer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedUser: UpdateUserDTO,
  ): Promise<User> {
    return this.usersService.updateUser(id, updatedUser);
  }

  @Post(':id/profile')
  createProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: CreateProfileDTO,
  ): Promise<User> {
    return this.usersService.createProfile(id, profile);
  }
}
