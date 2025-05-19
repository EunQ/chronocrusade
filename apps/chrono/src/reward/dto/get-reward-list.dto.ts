export class GetRewardListDto {
  rewardId?: string;
  lastModifiedBy?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}