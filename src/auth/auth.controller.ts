import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Controller('auth')
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
}
