import { IsString } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';

export class LoginDto extends PickType(CreateUserDto, ['email']) {
  @IsString()
  password: string;
}
