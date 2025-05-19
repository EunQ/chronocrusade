export class GetEventListDto {
  eventId?: string;
  isActive?: boolean;
  lastModifiedBy?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}