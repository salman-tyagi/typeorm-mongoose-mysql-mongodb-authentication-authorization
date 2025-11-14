import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectId } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: MongoRepository<User>
  ) {}

  findUser(id: ObjectId): Promise<User> {
    return this.repo.findOne({
      where: { _id: id },
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.repo.findOne({
      where: {
        email,
      },
      select: {
        _id: true,
      },
    });
  }
}
