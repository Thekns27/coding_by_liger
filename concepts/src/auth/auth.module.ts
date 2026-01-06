import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    // this will make the post repository avaliable for injection
    // avaliable in the current
    // scope
    TypeOrmModule.forFeature([User]),

    // prassport module
    PassportModule,

    // configure JWT
     JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService], // jwt strategy ,role guard -> todo
  exports: [AuthService],
})
export class AuthModule {}
