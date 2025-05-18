import { Module } from '@nestjs/common';
import { ChronoController } from './chrono.controller';
import { ChronoService } from './chrono.service';
import { EventModule } from './event/event.module';

@Module({
  imports: [EventModule],
  controllers: [ChronoController],
  providers: [ChronoService],
})
export class ChronoModule {}
