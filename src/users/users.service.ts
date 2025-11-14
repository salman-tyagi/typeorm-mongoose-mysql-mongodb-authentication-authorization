import { InjectDataSource } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectDataSource('users') private repo: MongoRepository<User>) {}
}
