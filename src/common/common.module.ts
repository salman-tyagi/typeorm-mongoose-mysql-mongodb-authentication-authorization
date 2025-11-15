import { Module } from '@nestjs/common';

import { EmailService } from './email.service';
import { UtilsService } from './utils.service';

@Module({
  providers: [EmailService, UtilsService],
  exports: [EmailService, UtilsService],
})
export class CommonModule {}
