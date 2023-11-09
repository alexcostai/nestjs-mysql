import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import {
  CreateProfileDTO,
  CreateUserDTO,
  LoginPayloadDTO,
  LoginUserDTO,
  UpdateUserDTO,
} from './dtos';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';

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
    return this.usersService.registerUser(newUser);
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

  @UseGuards(AuthGuard)
  @Post('/profile')
  createProfile(@Request() req): Promise<User> {
    const profile: CreateProfileDTO = req.body;
    return this.usersService.createProfile(req.user.sub, profile);
  }

  @Post('/login')
  loginUser(@Body() loginValues: LoginUserDTO): Promise<LoginPayloadDTO> {
    return this.usersService.loginUser(loginValues);
  }
}
