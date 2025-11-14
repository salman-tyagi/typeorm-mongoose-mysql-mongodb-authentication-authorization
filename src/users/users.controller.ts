import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('users')
@UseInterceptors(new SerializeInterceptor(UserDto))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findUser(ObjectId.createFromHexString(id));
  }

  @Get()
  getAllUsers(@Query() query: Partial<User> = {}): Promise<User[]> {
    return this.usersService.findUsers(query);
  }
}
