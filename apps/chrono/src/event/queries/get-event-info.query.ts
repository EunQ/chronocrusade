import { IQuery } from '@nestjs/cqrs';

export class GetEventInfoQuery implements IQuery {
  constructor(
    public readonly eventId?: string,
    public readonly isActive?: boolean,
    public readonly lastModifiedBy?: string,

    public readonly page: number = 1,
    public readonly limit: number = 10,

    public readonly sortBy: string = 'createdAt',
    public readonly sortOrder: 'asc' | 'desc' = 'desc',
  ) {}
}
