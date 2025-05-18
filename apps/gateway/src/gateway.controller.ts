import { Controller, Get, Inject, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RoleGuard } from '../guards/roles.guard';
import { Roles } from '../roles/roles.decorator';

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
  async findAllEvents(): Promise<Event> {
    return firstValueFrom(this.chronoClient.send('/events', {}));
  }
}
