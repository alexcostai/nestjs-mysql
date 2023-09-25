import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createUser(user: CreateUserDTO): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({
      id,
    });
  }

  updateUser(id: number, user: UpdateUserDto) {
    return this.userRepository.update({ id }, user);
  }
}
