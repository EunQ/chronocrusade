import { Role } from '../../apps/gateway/enums/roles.enum';

export class AdminUpdateUserDto {
  loginId: string;
  password?: string;
  roles?: Role[];
}
