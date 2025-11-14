import { IsString, IsEmail, IsStrongPassword, IsStrongPasswordOptions } from 'class-validator';

const passwordOptions: IsStrongPasswordOptions = {
  minLength: 6,
  minLowercase: 0,
  minNumbers: 0,
  minSymbols: 0,
  minUppercase: 0,
};

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(passwordOptions)
  password: string;

  @IsStrongPassword(passwordOptions)
  confirmPassword: string;
}
