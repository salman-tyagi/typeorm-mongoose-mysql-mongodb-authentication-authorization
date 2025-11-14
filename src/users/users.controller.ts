import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('users')
@UseInterceptors(new SerializeInterceptor(UserDto))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(ObjectId.createFromHexString(id));
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllUsers(@Query() query: Partial<User> = {}): Promise<User[]> {
    return this.usersService.findAll(query);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
    return this.usersService.updateOne(ObjectId.createFromHexString(id), body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<null> {
    return this.usersService.deleteOne(ObjectId.createFromHexString(id));
  }
}
