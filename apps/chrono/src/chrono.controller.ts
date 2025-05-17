import { Controller, Get } from '@nestjs/common';
import { ChronoService } from './chrono.service';

@Controller()
export class ChronoController {
  constructor(private readonly chronoService: ChronoService) {}

  @Get()
  getHello(): string {
    return this.chronoService.getHello();
  }
}
