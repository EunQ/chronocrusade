import { Body, Controller, Get, Inject, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RoleGuard } from '../guards/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { GameEvent } from '../../chrono/src/event/schema/event.schema';
import Any = jasmine.Any;
import { GetEventListDto } from '../../../common/dto/get-event-list.dto';
import { GetRewardListDto } from '../../../common/dto/get-reward-list.dto';
import { CreateEventDto } from '../../../common/dto/create-event.dto';
import { UpdateEventDto } from '../../../common/dto/update-event.dto';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('ROSETTE_SERVICE') private readonly rosetteClient: ClientProxy,
    @Inject('CHRONO_SERVICE') private readonly chronoClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.gatewayService.getHello();
  }

  @Get('/aHello')
  async aHello(): Promise<string> {
    const result$ = this.rosetteClient.send<string>('AHello', {});
    const result = await firstValueFrom(result$);
    console.log(`gateway hello ${result}`);
    return result;
  }

  @Get('/login')
  async login(@Query('loginId') loginId: string): Promise<{ token: string }> {
    const { token } = await firstValueFrom(
      this.rosetteClient.send('auth/login', { loginId }),
    );
    return { token };
  }

  @Get('/auth/verify')
  @UseGuards(RoleGuard)
  @Roles('admin')
  async helloB(@Req() req): Promise<string> {
    const user = req.user;
    console.log(user);
    return 'test';
    // return firstValueFrom(
    //   this.chronoClient.send('chrono/hello-b', { user })
    // );
  }


  @Get('/events')
  //@UseGuards(RoleGuard)
  //@Roles(['operator', 'admin'])
  async findAllEvents2(@Query() params: GetEventListDto) {
    return firstValueFrom(this.chronoClient.send('get.events', params));
  }

  @Post('/event')
  async createEvent(@Body() body: CreateEventDto): Promise<Any> {
    return firstValueFrom(this.chronoClient.send('create.event', body));
  }

  @Put('/event')
  async updateEvent(
    @Body() body: UpdateEventDto,
  ): Promise<Any> {
    return firstValueFrom(this.chronoClient.send('update.event', body));
  }

  @Get('/rewards')
  async findAllReward(@Query() params: GetRewardListDto): Promise<Any> {
    return firstValueFrom(this.chronoClient.send('/rewards', params));
  }
}
