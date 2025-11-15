import { PickType } from '@nestjs/mapped-types';

import { SignupDto } from './signup.dto';

export class ResetPasswordDto extends PickType(SignupDto, ['password', 'confirmPassword']) {}
