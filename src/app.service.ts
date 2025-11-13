import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  sendHello(): string {
    return 'Hello World!';
  }
}
