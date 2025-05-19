import { IsNumber, IsObject, IsString } from 'class-validator';
import { EvaluationItem } from '../../apps/chrono/src/user-reward/types/evaluationItem';

export class RewardItemDto {
  @IsString()
  eventId: string;

  @IsNumber()
  eventVersion: number;

  @IsObject()
  evaluations: EvaluationItem[];
}
