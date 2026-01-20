import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guard/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [
    // this will make the post repository avaliable for injection
    // avaliable in the current
    // scope
    TypeOrmModule.forFeature([User]),
    //passport module
    PassportModule,

    // configure JWT
    JwtModule.register({
      secret: 'jwt_secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard], // jwt strategy , roles guard
  exports: [AuthService, RolesGuard], // roles guard -> todo
})
export class AuthModule {}
