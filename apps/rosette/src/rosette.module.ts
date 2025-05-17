import { Module } from '@nestjs/common';
import { RosetteController } from './rosette.controller';
import { RosetteService } from './rosette.service';

@Module({
  imports: [],
  controllers: [RosetteController],
  providers: [RosetteService],
})
export class RosetteModule {}
