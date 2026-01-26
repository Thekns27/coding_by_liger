import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/entities/users.entity";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}


  async register(dto: RegisterDto) {
    const existUser = await this.usersService.findOneByEmail(dto.email );
    if (existUser) {
      throw new ConflictException('user already exist');
    }
    const user = await this.usersService.create(dto);
    return {messsage: 'redgister success',user};
  }

 async login(
    dto: LoginDto,
  ): Promise<{ message: string; data: User; token: string }> {
    const user = await this.usersService.findOneByEmail( dto.email );
    if (!user) {
      throw new Error('User not found!');
    }
    if (user.password !== dto.password) {
      throw new Error('Incorrect password!');
    }

    const access_token = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      { secret: 'kyaww' },
    );

    return { message: 'Login success!', data: user, token: access_token };
  }
}