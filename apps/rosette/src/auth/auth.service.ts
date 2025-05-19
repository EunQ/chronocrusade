import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './dto/auth-user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginUserDto } from '../../../../common/dto/login-user.dto';
import { hashPassword, isPasswordMatch } from '../../../../utils/hash-password';
import { CreateUserDto } from '../../../../common/dto/create-user.dto';
import { UpdateUserDto } from '../../../../common/dto/update-user.dto';
import { LockService } from '../../../../common/lock/lock.service';
import { AdminUpdateUserDto } from '../../../../common/dto/admin-update-user.dto';

export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly lockService: LockService,
  ) {}

  async handleLogin(@Payload() data: LoginUserDto) {
    const user = await this.userModel.findOne({ id: data.loginId }).exec();
    if (!user) {
      throw new RpcException('사용자를 찾을 수 없습니다.');
    }

    if (user.encPassword) {
      const isMatch = await isPasswordMatch(data.password, user.encPassword);
      if (!isMatch) {
        throw new RpcException('사용자를 찾을 수 없습니다.');
      }
    }

    const payload = { id: user.id, roles: user.roles };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async createUser(dto: CreateUserDto) {
    const locked = this.lockService.acquireLock(User.name, dto.loginId, 10);
    if (!locked) {
      throw new RpcException(`유저 '${dto.loginId}'는 현재 수정 중입니다.`);
    }

    try {
      const exists = await this.userModel.exists({ id: dto.loginId });
      if (exists) throw new RpcException('이미 존재하는 사용자입니다.');

      const encPassword = await hashPassword(dto.password);

      const user = new this.userModel({
        id: dto.loginId,
        encPassword,
        roles: dto.roles,
      });

      return user.save();
    } finally {
      await this.lockService.releaseLock(User.name, dto.loginId);
    }
  }

  async updateUser(dto: UpdateUserDto) {
    const locked = this.lockService.acquireLock(User.name, dto.loginId, 10);
    if (!locked) {
      throw new RpcException(
        `유저 '${dto.loginId}'는 현재 수정 중입니다.`,
      );
    }

    try {
      const user = await this.userModel.findOne({ id: dto.loginId });
      if (!user) throw new RpcException('사용자를 찾을 수 없습니다.');

      if (user.encPassword) {
        const isMatch = await isPasswordMatch(dto.password, user.encPassword);
        if (!isMatch) {
          throw new RpcException('사용자를 찾을 수 없습니다.');
        }
      }

      if (dto.newPassword) {
        user.encPassword = await hashPassword(dto.newPassword);
      }

      if (dto.roles) {
        user.roles = dto.roles;
      }

      return user.save();
    } finally {
      await this.lockService.releaseLock(User.name, dto.loginId);
    }
  }

  async adminUpdateUser(dto: AdminUpdateUserDto) {
    const locked = this.lockService.acquireLock(User.name, dto.loginId, 10);
    if (!locked) {
      throw new RpcException(
        `유저 '${dto.loginId}'는 현재 수정 중입니다.`,
      );
    }

    try {
      const user = await this.userModel.findOne({ id: dto.loginId });
      if (!user) throw new RpcException('사용자를 찾을 수 없습니다.');

      if (dto.password) {
        user.encPassword = await hashPassword(dto.password);
      }
      if (dto.roles) {
        user.roles = dto.roles;
      }

      return user.save();
    } finally {
      await this.lockService.releaseLock(User.name, dto.loginId);
    }
  }

  async verify({ token }: { token: string }) {
    const realToken = token?.split(' ')[1];
    const user = this.jwtService.verify(realToken);
    return user;
  }
}
