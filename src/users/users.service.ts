import { InjectDataSource } from '@nestjs/typeorm';
import { MongoRepository, ObjectId } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource({
      type: 'mongodb',
    })
    private repo: MongoRepository<User>
  ) {}

  async findUser(id: ObjectId): Promise<User> {
    return this.repo.findOne({
      where: { _id: id },
    });
  }
}
