import { Module } from '@nestjs/common';
import { ChronoController } from './chrono.controller';
import { ChronoService } from './chrono.service';

@Module({
  imports: [],
  controllers: [ChronoController],
  providers: [ChronoService],
})
export class ChronoModule {}
