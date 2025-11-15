import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { SignupDto } from './dtos/signup.dto';
import { UserDto } from '../users/dtos/user.dto';
import { LoginDto } from './dtos/login.dto';

import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
// import { CookieInterceptor } from './interceptors/cookie.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@UseInterceptors(new SerializeInterceptor(UserDto))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    const { password, confirmPassword } = body;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password mismatch');
    }

    return this.authService.register(body);
  }

  @Post('login')
  // @UseInterceptors(CookieInterceptor)
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('forgot-password')
  forgotPassword(@Body() { email }: { email: string }) {
    return this.authService.forgotPassword(email);
  }

  resetPassword() {}
}
