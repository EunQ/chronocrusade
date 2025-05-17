import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './dto/auth-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Controller()
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  @MessagePattern('auth/login')
  async handleLogin(@Payload() data: { loginId: string }) {
    console.log(`handle login data: ${JSON.stringify(data)}`);
    const user = await this.userModel.findOne({ id: data.loginId }).exec();
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const payload = { id: user.id, roles: user.roles };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
