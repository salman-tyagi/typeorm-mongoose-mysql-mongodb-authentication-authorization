import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dtos/create-user.dto';

import { UsersService } from '../users/users.service';
import { EmailService } from '../common/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: MongoRepository<User>,
    private usersService: UsersService,
    private emailService: EmailService,
    private jwtService: JwtService
  ) {}

  async register({ name, email, password }: CreateUserDto) {
    const users = await this.usersService.findAll({ email });

    if (users.length) {
      throw new BadRequestException('email already exists');
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = this.repo.create({ name, email, password: hashedPass });

    if (newUser) {
      this.emailService.sendWelcomeMail(newUser);
    }

    return this.repo.save(newUser);
  }

  async login(email: string, password: string) {
    // Find user
    const [user] = await this.usersService.findAll({ email });

    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    // Check user password
    const isValidPass = await bcrypt.compare(password, user.password);

    if (!isValidPass) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    // Generate token
    const token = await this.jwtService.signAsync({ _id: user._id });

    // Set cookie => use interceptor
    // send response
    return { ...user, token };
  }
}
