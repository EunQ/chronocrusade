import { Transform } from 'class-transformer';

export class GetEventListDto {
  eventId?: string;
  isActive?: boolean;
  lastModifiedBy?: string;

  @Transform(({ value }) => Number(value))
  page?: number;

  @Transform(({ value }) => Number(value))
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}