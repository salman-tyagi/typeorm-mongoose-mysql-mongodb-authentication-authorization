import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import bcrypt from 'bcryptjs';

import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dtos/create-user.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: MongoRepository<User>,
    private usersService: UsersService
  ) {}

  async register(body: CreateUserDto) {
    const user = await this.usersService.findUserByEmail(body.email);

    if (user) {
      throw new BadRequestException('email already exists');
    }

    const hashedPass = await bcrypt.hash(body.password, 12);

    const newUser = this.repo.create({ ...body, password: hashedPass });
    return this.repo.save(newUser);
  }
}
