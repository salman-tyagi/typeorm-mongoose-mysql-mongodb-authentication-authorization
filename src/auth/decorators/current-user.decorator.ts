import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestUser } from '../guards/auth.guard';

export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
  const req: RequestUser = context.switchToHttp().getRequest();
  return req.user;
});
