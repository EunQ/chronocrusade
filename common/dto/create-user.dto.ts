import { Role } from '../../apps/gateway/enums/roles.enum';

export class CreateUserDto {
  loginId: string;
  password: string;
  roles: Role[];
}
