import { UserRewardStatus } from '../../apps/chrono/src/user-reward/enum/user-reward.status';

export class GetUserRewardLogDto {
  userId?: string;
  eventId?: string;
  status?: UserRewardStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
