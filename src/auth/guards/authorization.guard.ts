import { CanActivate, ExecutionContext } from '@nestjs/common';

import { Roles } from '../../users/user.entity';
import { RequestUser } from './auth.guard';

export class AuthorizationGuard implements CanActivate {
  constructor(private roles: Roles[]) {}

  canActivate(context: ExecutionContext): any {
    const req: RequestUser = context.switchToHttp().getRequest();
    return this.roles.includes(req.user.role);
  }
}
