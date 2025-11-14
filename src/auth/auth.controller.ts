import { BadRequestException, Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserDto } from '../users/dtos/user.dto';

import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(new SerializeInterceptor(UserDto))
  signup(@Body() body: CreateUserDto) {
    const { password, confirmPassword } = body;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password mismatch');
    }

    return this.authService.register(body);
  }
}
