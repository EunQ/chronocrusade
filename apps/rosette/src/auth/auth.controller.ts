import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './dto/auth-user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginUserDto } from '../../../../common/dto/login-user.dto';
import { isPasswordMatch } from '../../../../utils/hash-password';

@Controller()
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  @MessagePattern('auth/login')
  async handleLogin(@Payload() data: LoginUserDto) {
    console.log(`handleLogin ${JSON.stringify(data)}`);

    const user = await this.userModel.findOne({ id: data.loginId }).exec();
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    if (user.encPassword) {
      const isMatch = await isPasswordMatch(data.password, user.encPassword);
      if (!isMatch) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }
    }

    const payload = { id: user.id, roles: user.roles };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  @MessagePattern('auth/verify')
  async verify(@Payload() { token }: { token: string }) {
    const realToken = token?.split(' ')[1];
    const user = this.jwtService.verify(realToken);
    return user;
  }
}
