import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RewardItem } from '../../apps/chrono/src/reward/types/reward-item.type';

export class UpdateRewardDto {
  @IsString()
  rewardId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  items?: RewardItem[];

  @IsOptional()
  @IsString()
  eventId?: string;
}
