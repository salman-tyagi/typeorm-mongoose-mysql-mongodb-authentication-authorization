import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import bcrypt from 'bcryptjs';

import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dtos/create-user.dto';

import { UsersService } from '../users/users.service';
import { EmailService } from '../common/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: MongoRepository<User>,
    private usersService: UsersService,
    private emailService: EmailService
  ) {}

  async register({ name, email, password }: CreateUserDto) {
    const user = await this.usersService.findAll({ email });

    if (user.length) {
      throw new BadRequestException('email already exists');
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = this.repo.create({ name, email, password: hashedPass });

    if (newUser) {
      this.emailService.sendWelcomeMail(newUser);
    }

    return this.repo.save(newUser);
  }
}
