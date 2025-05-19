import { Transform } from 'class-transformer';

export class GetRewardListDto {
  rewardId?: string;
  lastModifiedBy?: string;

  /**
   * items 배열 내부에 type이 포함된 경우만 필터링
   */
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  types?: string[];

  @Transform(({ value }) => Number(value))
  page?: number;

  @Transform(({ value }) => Number(value))
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
