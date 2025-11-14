import { ObjectId } from 'typeorm';
import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  @Transform(({ obj }) => obj._id)
  _id: ObjectId;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
