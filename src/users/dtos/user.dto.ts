import { ObjectId } from 'typeorm';
import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UserDto {
  @Expose()
  @Transform(({ obj }) => obj._id)
  _id: ObjectId;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  @IsOptional()
  token: string;

  @Expose()
  @IsOptional()
  message: string;
}
