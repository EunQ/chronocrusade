import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Role } from '../enums/roles.enum';

// @Roles(...)
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// @MatchUser(..._
export const USER_MATCH_KEY = 'matchUser';
export const MatchUser = (isMatch: boolean) =>
  SetMetadata(USER_MATCH_KEY, isMatch);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('ROSETTE_SERVICE') private readonly rosetteClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const matchUser = this.reflector.getAllAndOverride<boolean>(
      USER_MATCH_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = context.switchToHttp().getRequest();
    const token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException();

    const user = await firstValueFrom(
      this.rosetteClient.send('auth.verify', { token }),
    );
    req.user = user;

    if (requiredRoles?.length) {
      const hasRole = user.roles?.some((r: Role) => requiredRoles.includes(r));
      if (!hasRole)
        throw new UnauthorizedException('권한이 올바르지 않습니다.');
    }

    if (matchUser) {
      const paramUserId =
        req.params?.userId || req.body?.userId || req.query?.userId;
      if (!paramUserId || paramUserId !== user.id) {
        throw new UnauthorizedException('사용자 정보가 일치하지 않습니다.');
      }
    }
    return true;
  }
}
