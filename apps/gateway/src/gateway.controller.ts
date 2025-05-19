import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { MatchUser, RoleGuard, Roles } from '../guards/roles.guard';
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
import { AdminUpdateUserDto } from '../../../common/dto/admin-update-user.dto';
import Any = jasmine.Any;

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
      this.rosetteClient.send('auth.login', body).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
    return { token };
  }

  @Post('/user/signup')
  async signup(@Body() body: CreateUserDto) {
    return await firstValueFrom(
      this.rosetteClient.send('signup.user', body).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }

  @Post('/user')
  async updateUser(@Body() body: UpdateUserDto) {
    return await firstValueFrom(
      this.rosetteClient.send('update.user', body).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }

  @Post('/admin/user')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  async adminUpdateUser(@Body() body: AdminUpdateUserDto) {
    return await firstValueFrom(
      this.rosetteClient.send('admin.update.user', body).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }

  /*
  이벤트 조회
   */
  @Get('/events')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  async getEvents(@Query() params: GetEventListDto) {
    return firstValueFrom(
      this.chronoClient.send('get.events', params).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }

  /*
  이벤트 생성.
   */
  @Post('/event')
  @Roles(Role.ADMIN, Role.OPERATOR)
  async createEvent(@Body() body: CreateEventDto): Promise<Any> {
    return firstValueFrom(
      this.chronoClient.send('create.event', body).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }

  /*
  이벤트 수정.
   */
  @Put('/event')
  @Roles(Role.ADMIN, Role.OPERATOR)
  async updateEvent(@Body() body: UpdateEventDto): Promise<Any> {
    return firstValueFrom(
      this.chronoClient.send('update.event', body).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }

  /*
  보상 조회
   */
  @Get('/rewards')
  @Roles(Role.ADMIN, Role.OPERATOR)
  async findAllReward(@Query() params: GetRewardListDto): Promise<Any> {
    return firstValueFrom(
      this.chronoClient.send('get.rewards', params).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }

  /*
  보상 등록.
   */
  @Post('/reward')
  @Roles(Role.ADMIN, Role.OPERATOR)
  async createReward(@Body() body: CreateRewardDto): Promise<Any> {
    return firstValueFrom(
      this.chronoClient.send('create.reward', body).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }

  /*
    보상 수정.
   */
  @Put('/reward')
  @Roles(Role.ADMIN, Role.OPERATOR)
  async updateReward(@Body() body: UpdateRewardDto): Promise<Any> {
    return firstValueFrom(
      this.chronoClient.send('update.reward', body).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }

  /*
  보상 요청
   */
  @Post('/user/reward')
  @UseGuards(RoleGuard)
  @MatchUser(true)
  @Roles(Role.USER)
  async requestUserReward(@Body() body: UserRewardRequest) {
    return firstValueFrom(
      this.chronoClient.send('request.userReward', body).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }

  @Get('/user/reward/logs')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR, Role.USER)
  async getUserRewardLogs(@Query() params: GetUserRewardLogDto, @Req() req) {
    const { roles, id: currentUserId } = req.user;
    const isUserOnly = roles.length === 1 && roles.includes(Role.USER);
    if (isUserOnly) {
      if (!params.userId || currentUserId !== params.userId) {
        throw new ForbiddenException(
          'USER 권한은 userId 올바른 파라미터가 필수입니다.',
        );
      }
    }

    return firstValueFrom(
      this.chronoClient.send('get.userRewardLogs', params).pipe(
        catchError((error) => {
          const errorMessage = error?.message || 'Internal server error';
          throw new InternalServerErrorException(errorMessage);
        }),
      ),
    );
  }
}
