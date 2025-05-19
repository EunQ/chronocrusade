import { IQuery } from '@nestjs/cqrs';
import { UserRewardStatus } from '../enum/user-reward.status';

export class GetUserRewardLogQuery implements IQuery {
  public readonly userId?: string;
  public readonly eventId?: string;
  public readonly status?: UserRewardStatus;

  public readonly page: number;
  public readonly limit: number;
  public readonly sortBy: string;
  public readonly sortOrder: 'asc' | 'desc';

  constructor({
    userId,
    eventId,
    status,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }: {
    userId?: string;
    eventId?: string;
    status?: UserRewardStatus;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    this.userId = userId;
    this.eventId = eventId;
    this.status = status;
    this.page = page;
    this.limit = limit;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }

  isFirstLog(): boolean {
    return this.page === 1 && this.limit === 1;
  }
}
