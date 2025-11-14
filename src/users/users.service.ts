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

  findUsers(query: Partial<User>): Promise<User[]> {
    return this.repo.find(query);
  }
}
