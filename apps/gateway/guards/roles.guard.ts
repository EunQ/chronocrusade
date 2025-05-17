import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ROLES_KEY } from '../roles/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('ROSETTE_SERVICE') private readonly rosetteClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();
    const token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException();

    const user = await firstValueFrom(
      this.rosetteClient.send('auth/verify', { token }),
    );
    req.user = user;

    const hasRole = user.roles?.some((r: string) => requiredRoles.includes(r));
    if (!hasRole) throw new ForbiddenException('권한이 올바르지 않습니다.');

    return true;
  }
}
