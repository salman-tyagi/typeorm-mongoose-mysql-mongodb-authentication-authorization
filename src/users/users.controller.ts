import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObjectId } from 'typeorm';

import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findUser(ObjectId.createFromHexString(id));
  }

  @Get()
  getUserByEmail(@Query('email') email: string): Promise<User> {
    return this.usersService.findUserByEmail(email);
  }
}
