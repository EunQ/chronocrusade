import { Module } from '@nestjs/common';
import { RosetteController } from './rosette.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RosetteController],
  providers: [],
})
export class RosetteModule {}
