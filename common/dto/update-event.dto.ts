import {
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { EventCondition } from '../../apps/chrono/src/event/types/event-condition.type';

export class UpdateEventDto {
  @IsString()
  eventId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  conditions?: EventCondition[];

  @IsOptional()
  @IsArray()
  rewardIds?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
