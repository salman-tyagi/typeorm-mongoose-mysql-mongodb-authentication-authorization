import crypto from 'node:crypto';

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilsService {
  constructor(private configService: ConfigService) {}

  isPasswordEqual(pass1: string, pass2: string) {
    if (pass1 !== pass2) {
      throw new BadRequestException('Password mismatch');
    }
  }

  createHmacResetToken(token: string) {
    return crypto
      .createHmac('sha256', this.configService.get<string>('PASSWORD_RESET_SECRET'))
      .update(token)
      .digest('hex');
  }
}
