import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UtilsService } from '../common/utils.service';

import { SignupDto } from './dtos/signup.dto';
import { UserDto } from '../users/dtos/user.dto';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
// import { CookieInterceptor } from './interceptors/cookie.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@UseInterceptors(new SerializeInterceptor(UserDto))
export class AuthController {
  constructor(private authService: AuthService, private utilsService: UtilsService) {}

  @Post('signup')
  signup(@Body() { name, email, password, confirmPassword }: SignupDto) {
    this.utilsService.isPasswordEqual(password, confirmPassword);

    return this.authService.register(name, email, password);
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

  @Patch('reset-password/:resetToken')
  resetPassword(
    @Body() { password, confirmPassword }: ResetPasswordDto,
    @Param('resetToken') resetToken: string
  ) {
    this.utilsService.isPasswordEqual(password, confirmPassword);

    return this.authService.resetPassword(password, resetToken);
  }
}
