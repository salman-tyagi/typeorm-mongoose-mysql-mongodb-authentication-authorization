import { BadRequestException, Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserDto } from '../users/dtos/user.dto';
import { LoginDto } from '../users/dtos/login.dto';

import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

@Controller('auth')
@UseInterceptors(new SerializeInterceptor(UserDto))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    const { password, confirmPassword } = body;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password mismatch');
    }

    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }
}
