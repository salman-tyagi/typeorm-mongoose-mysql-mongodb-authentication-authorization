import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectId } from 'typeorm';

import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: MongoRepository<User>
  ) {}

  findOne(id: ObjectId): Promise<User> {
    return this.repo.findOne({
      where: { _id: id },
    });
  }

  findAll(query: Partial<User>): Promise<User[]> {
    return this.repo.find(query);
  }

  async updateOne(id: ObjectId, body: UpdateUserDto) {
    // Find user
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // Update user
    Object.assign(user, body);

    // Return user
    return this.repo.save(user);
  }

  async deleteOne(id: ObjectId): Promise<null> {
    // Find user
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // Remove user
    this.repo.remove(user);
    return null;
  }
}
