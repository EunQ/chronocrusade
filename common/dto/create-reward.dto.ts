import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RewardItem } from '../../apps/chrono/src/reward/types/reward-item.type';

export class CreateRewardDto {
  @IsArray()
  @ValidateNested({ each: true })
  items: RewardItem[];

  @IsOptional()
  @IsString()
  eventId?: string;
}
