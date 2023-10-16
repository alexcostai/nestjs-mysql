import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { CreateProfileDTO } from 'src/dto/create-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async createUser(user: CreateUserDTO): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });
    if (userFound) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['profile', 'posts'],
    });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    const result = await this.userRepository.delete({
      id,
    });
    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async updateUser(id: number, user: UpdateUserDTO): Promise<User> {
    const userFound = await this.findUserById(id);
    const updateUser = Object.assign(userFound, user);
    return this.userRepository.save(updateUser);
  }

  async createProfile(id: number, profile: CreateProfileDTO): Promise<User> {
    const userFound = await this.findUserById(id);
    const newProfile = this.profileRepository.create(profile);
    const savedProfile = await this.profileRepository.save(newProfile);
    userFound.profile = savedProfile;
    return this.userRepository.save(userFound);
  }

  // Este método es diferente al getUsersById
  // Trae el usuario sin relaciones para que tarde menos la consulta
  // ya que solo se usa para validar si existe
  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
