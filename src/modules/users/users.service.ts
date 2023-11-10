import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, FindOptionsRelations, Repository } from 'typeorm';
import {
  CreateUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
  UserPayloadDTO,
  UpdateProfileDTO,
} from './dtos';
import { User } from './user.entity';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginValues: LoginUserDTO): Promise<UserPayloadDTO> {
    const userFound = await this.userRepository.findOne({
      where: {
        email: loginValues.email,
      },
    });
    if (userFound.password != loginValues.password) {
      throw new HttpException('Failed to login', HttpStatus.CONFLICT);
    }
    return {
      user: userFound,
      token: await this.generateUserToken(userFound),
    };
  }

  async registerUser(user: CreateUserDTO): Promise<UserPayloadDTO> {
    const userFound = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });
    if (userFound) {
      throw new HttpException('Error registering user', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return {
      user: newUser,
      token: await this.generateUserToken(newUser),
    };
  }

  async getUser(id: number): Promise<User> {
    return this.findUserById(id, { profile: true });
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

  async updateProfile(
    userId: number,
    profile: UpdateProfileDTO,
  ): Promise<User> {
    const userFound = await this.findUserById(userId, { profile: true });
    const updatedProfile = Object.assign(userFound.profile, profile);
    const savedProfile = await this.profileRepository.save(updatedProfile);
    userFound.profile = savedProfile;
    return this.userRepository.save(userFound);
  }

  // Este método es diferente al getUsersById
  // Trae el usuario sin relaciones para que tarde menos la consulta
  // ya que solo se usa para validar si existe
  async findUserById(
    id: number,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private generateUserToken({ id, email }: User): Promise<string> {
    const payload = { sub: id, email: email };
    return this.jwtService.signAsync(payload);
  }
}
