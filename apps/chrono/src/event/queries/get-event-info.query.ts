import { IQuery } from '@nestjs/cqrs';

export class GetEventInfoQuery implements IQuery {
  constructor(
    public readonly eventId?: string,
    public readonly isActive?: boolean,
    public readonly lastModifiedBy?: string,

    // ✅ 페이징
    public readonly page: number = 1,
    public readonly limit: number = 10,

    // ✅ 정렬
    public readonly sortBy: string = 'createdAt',
    public readonly sortOrder: 'asc' | 'desc' = 'desc',
  ) {}
}
