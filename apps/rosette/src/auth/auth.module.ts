import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './dto/auth-user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:1234@localhost:27017/auth?authSource=admin',
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      //secret: process.env.JWT_SECRET ?? 'test',
      secret: 'test',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
