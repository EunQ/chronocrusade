import {
  IsOptional,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CouponDto {
  @IsString()
  id: string;

  @IsNumber()
  count: number;
}

export class UpdateRewardDto {
  @IsString()
  rewardId: string; // 필수 (기준 ID)

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CouponDto)
  coupons?: CouponDto[];

  @IsOptional()
  @IsNumber()
  gold?: number;

  @IsOptional()
  @IsNumber()
  exp?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eventIds?: string[];
}
