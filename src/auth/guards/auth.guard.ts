import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { ObjectId } from 'mongodb';

import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';

export interface RequestUser extends Request {
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: RequestUser = context.switchToHttp().getRequest();

      const token = req.cookies?.token || req.headers.authorization?.split(' ')?.at(-1);

      if (!token) {
        throw new UnauthorizedException('You are not logged in');
      }

      const { _id } = await this.jwtService.verifyAsync<{ _id: string; exp: number; iat: number }>(
        token
      );

      const user = await this.usersService.findOne(ObjectId.createFromHexString(_id));

      if (!user) {
        throw new NotFoundException('User not found with this token');
      }

      req.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
