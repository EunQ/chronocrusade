import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RoleGuard, Roles } from '../guards/roles.guard';
import { GetEventListDto } from '../../../common/dto/get-event-list.dto';
import { GetRewardListDto } from '../../../common/dto/get-reward-list.dto';
import { CreateEventDto } from '../../../common/dto/create-event.dto';
import { UpdateEventDto } from '../../../common/dto/update-event.dto';
import { CreateRewardDto } from '../../../common/dto/create-reward.dto';
import { UpdateRewardDto } from '../../../common/dto/update-reward.dto';
import { UserRewardRequest } from '../../../common/dto/user-reward.request';
import { GetUserRewardLogDto } from '../../../common/dto/get-user-reward-log.dto';
import { LoginUserDto } from '../../../common/dto/login-user.dto';
import { Role } from '../enums/roles.enum';
import { CreateUserDto } from '../../../common/dto/create-user.dto';
import { UpdateUserDto } from '../../../common/dto/update-user.dto';
import Any = jasmine.Any;
import { AdminUpdateUserDto } from '../../../common/dto/admin-update-user.dto';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('ROSETTE_SERVICE') private readonly rosetteClient: ClientProxy,
    @Inject('CHRONO_SERVICE') private readonly chronoClient: ClientProxy,
  ) {}

  @Post('/auth/login')
  async login(@Body() body: LoginUserDto): Promise<{ token: string }> {
    const { token } = await firstValueFrom(
      this.rosetteClient.send('auth/login', body),
    );
    return { token };
  }

  @Post('/user/signin')
  async signin(@Body() body: CreateUserDto) {
    return await firstValueFrom(this.rosetteClient.send('sigin.user', body));
  }

  @Post('/user')
  async updateUser(@Body() body: UpdateUserDto) {
    return await firstValueFrom(this.rosetteClient.send('update.user', body));
  }

  @Post('/admin/user')
  @Roles(Role.ADMIN)
  async adminUpdateUser(@Body() body: AdminUpdateUserDto) {
    return await firstValueFrom(
      this.rosetteClient.send('admin.update.user', body),
    );
  }

  @Get('/events')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  async getEvents(@Query() params: GetEventListDto) {
    return firstValueFrom(this.chronoClient.send('get.events', params));
  }

  @Post('/event')
  async createEvent(@Body() body: CreateEventDto): Promise<Any> {
    return firstValueFrom(this.chronoClient.send('create.event', body));
  }

  @Put('/event')
  async updateEvent(@Body() body: UpdateEventDto): Promise<Any> {
    return firstValueFrom(this.chronoClient.send('update.event', body));
  }

  @Get('/rewards')
  async findAllReward(@Query() params: GetRewardListDto): Promise<Any> {
    return firstValueFrom(this.chronoClient.send('get.rewards', params));
  }

  @Post('/reward')
  async createReward(@Body() body: CreateRewardDto): Promise<Any> {
    return firstValueFrom(this.chronoClient.send('create.reward', body));
  }

  @Put('/reward')
  async updateReward(@Body() body: UpdateRewardDto): Promise<Any> {
    return firstValueFrom(this.chronoClient.send('update.reward', body));
  }

  @Post('/user/reward')
  async requestUserReward(@Body() body: UserRewardRequest) {
    return firstValueFrom(this.chronoClient.send('request.userReward', body));
  }

  @Get('/user/reward/logs')
  async getUserRewardLogs(@Query() params: GetUserRewardLogDto) {
    return firstValueFrom(this.chronoClient.send('get.userRewardLogs', params));
  }
}
