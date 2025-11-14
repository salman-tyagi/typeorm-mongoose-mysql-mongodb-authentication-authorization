import { NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: never, handler: CallHandler): Observable<any> {
    //
    return handler.handle().pipe(
      map((data: any) => {
        const result = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
        return result;
      })
    );
  }
}
