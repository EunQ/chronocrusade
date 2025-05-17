import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('ROSETTE_SERVICE') private readonly rosetteClient: ClientProxy,
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
}
