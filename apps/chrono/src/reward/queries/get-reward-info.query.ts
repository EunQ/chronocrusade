import { IQuery } from '@nestjs/cqrs';

export class GetRewardInfoQuery implements IQuery {
  public readonly rewardId?: string;
  public readonly lastModifiedBy?: string;
  public readonly types?: string[];

  public readonly page: number;
  public readonly limit: number;
  public readonly sortBy: string;
  public readonly sortOrder: 'asc' | 'desc';

  constructor({
    rewardId,
    lastModifiedBy,
    types,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }: {
    rewardId?: string;
    lastModifiedBy?: string;
    types?: string[];
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    this.rewardId = rewardId;
    this.lastModifiedBy = lastModifiedBy;
    this.types = types;
    this.page = page;
    this.limit = limit;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }
}
