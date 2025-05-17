import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export enum Role {
  USER = 'user', // 보상 요청 가능
  OPERATOR = 'operator', // 이벤트/보상 등록 가능
  AUDITOR = 'auditor', // 보상 이력 조회만 가능
  ADMIN = 'admin', // 모든 기능 접근 가능
}
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);