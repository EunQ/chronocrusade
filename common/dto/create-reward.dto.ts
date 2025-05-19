import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RewardItemDto } from './reward-item.dto';

export class CreateRewardDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RewardItemDto)
  items: RewardItemDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eventIds?: string[];
}
