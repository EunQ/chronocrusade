import { Injectable } from '@nestjs/common';

@Injectable()
export class RosetteService {
  getHello(): string {
    return 'Hello World!';
  }
}
