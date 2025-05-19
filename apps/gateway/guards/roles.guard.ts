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

    const req = context.switchToHttp().getRequest();
    const token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException();

    const user = await firstValueFrom(
      this.rosetteClient.send('auth/verify', { token }),
    );

    if (requiredRoles?.length) {
      const hasRole = user.roles?.some((r: Role) => requiredRoles.includes(r));
      if (!hasRole) throw new ForbiddenException('권한이 올바르지 않습니다.');
    }

    return true;
  }
}
