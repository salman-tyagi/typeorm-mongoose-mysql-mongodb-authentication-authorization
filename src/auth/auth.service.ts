import crypto from 'node:crypto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';

import { User } from '../users/user.entity';

import { UsersService } from '../users/users.service';
import { EmailService } from '../common/email.service';
import { UtilsService } from '../common/utils.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: MongoRepository<User>,
    private usersService: UsersService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private utilsService: UtilsService
  ) {}

  async register(name: string, email: string, password: string) {
    const users = await this.usersService.findAll({ email });

    if (users.length) {
      throw new BadRequestException('email already exists');
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = this.repo.create({ name, email, password: hashedPass });

    if (newUser) {
      this.emailService.sendWelcomeMail(newUser);
      delete newUser.passwordResetToken;
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

  async forgotPassword(email: string) {
    // Find user, exists or not
    const [user] = await this.usersService.findAll({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate verify token
    const tokenExpiredAt = Math.round(Date.now() + 10 * 60 * 1000);

    const passwordResetToken = `${user._id}.${tokenExpiredAt}.${crypto
      .randomBytes(10)
      .toString('hex')}`;

    // Create reset link
    const resetLink = `${this.configService.get<string>(
      'BASE_URL'
    )}/reset-password/${passwordResetToken}`;

    // Send reset link in mail
    this.emailService.sendResetToken(user, resetLink);

    // Hash reset token
    const hashedPasswordResetToken = this.utilsService.createHmacResetToken(passwordResetToken);

    // Save hashed reset token in DB
    Object.assign(user, { passwordResetToken: hashedPasswordResetToken });
    this.repo.save(user);

    return { message: 'Password reset email sent!' };
  }

  async resetPassword(password: string, resetToken: string) {
    const [_id, timeStamp] = resetToken.split('.');

    // Check token expiration
    const isTokenExpired = Date.now() > parseInt(timeStamp);

    if (isTokenExpired) {
      throw new BadRequestException('Reset password link expired');
    }

    // Find user
    const user = await this.usersService.findOne(ObjectId.createFromHexString(_id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Compare reset token =========>
    const hashedToken = this.utilsService.createHmacResetToken(resetToken);

    if (user.passwordResetToken !== hashedToken) {
      throw new BadRequestException('Invalid reset token');
    }

    // Hash login password
    const hashedPass = await bcrypt.hash(password, 12);

    // Update password
    user.passwordResetToken = '';
    user.password = hashedPass;

    this.repo.save(user);

    return { message: 'Password updated successfully' };
  }
}
