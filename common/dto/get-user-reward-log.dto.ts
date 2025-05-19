import { UserRewardStatus } from '../../apps/chrono/src/user-reward/enum/user-reward.status';

export class GetUserRewardLogDto {
  constructor(
    readonly userId?: string,
    readonly eventId?: string,
    readonly status?: UserRewardStatus,
    readonly page?: number,
    readonly limit?: number,
    readonly sortBy?: string,
    readonly sortOrder?: 'asc' | 'desc',
  ) {}
}
