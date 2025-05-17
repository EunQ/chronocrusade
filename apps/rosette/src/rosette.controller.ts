import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class RosetteController {
  @MessagePattern('AHello')
  aHello(): string {
    return 'AHello';
  }
}
