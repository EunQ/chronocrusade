import { Role } from '../../apps/gateway/enums/roles.enum';

export class UpdateUserDto {
  loginId: string;
  password: string;
  newPassword?: string;
  roles?: Role[];
}
