import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class RewardItemDto {
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsNumber()
  count: number;

  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;
}
