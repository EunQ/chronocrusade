import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto } from '../../../../common/dto/login-user.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../../../common/dto/create-user.dto';
import { UpdateUserDto } from '../../../../common/dto/update-user.dto';
import { AdminUpdateUserDto } from '../../../../common/dto/admin-update-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.login')
  async handleLogin(@Payload() data: LoginUserDto) {
    return this.authService.handleLogin(data);
  }

  @MessagePattern('auth.verify')
  async verify(@Payload() { token }: { token: string }) {
    return this.authService.verify({ token });
  }

  @MessagePattern('signup.user')
  async signup(@Payload() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  @MessagePattern('update.user')
  async updateUser(@Payload() dto: UpdateUserDto) {
    return this.authService.updateUser(dto);
  }

  @MessagePattern('admin.update.user')
  async adminUpdateUser(@Payload() dto: AdminUpdateUserDto) {
    return this.authService.adminUpdateUser(dto);
  }
}
