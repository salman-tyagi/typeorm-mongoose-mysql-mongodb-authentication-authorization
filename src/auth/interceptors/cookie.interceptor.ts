import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Response } from 'express';

import { UserDto } from '../../users/dtos/user.dto';

export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<UserDto> {
    return handler.handle().pipe(
      map((user: UserDto) => {
        const res: Response = context.switchToHttp().getResponse();

        res.cookie('token', user.token, {
          expires: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
        });

        return user;
      })
    );
  }
}
