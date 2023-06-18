import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkIfEmailIsAvailable(createUserDto);

    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ email });

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async get(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async checkIfEmailIsAvailable({ email }: CreateUserDto): Promise<any> {
    try {
      await this.usersRepository.findOne({ email });
    } catch (_error) {
      return;
    }

    throw new UnprocessableEntityException('Email already taken');
  }
}
