import { Injectable } from '@nestjs/common';

@Injectable()
export class ChronoService {
  getHello(): string {
    return 'Hello World!';
  }
}
