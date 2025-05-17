import { Controller, Get } from '@nestjs/common';
import { RosetteService } from './rosette.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class RosetteController {
  constructor(private readonly rosetteService: RosetteService) {}

  @Get()
  getHello(): string {
    return this.rosetteService.getHello();
  }

  @MessagePattern('AHello')
  aHello(): string {
    return 'AHello';
  }
}
