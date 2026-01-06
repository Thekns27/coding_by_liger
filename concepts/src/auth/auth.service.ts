import { Secret } from './../../node_modules/@types/jsonwebtoken/index.d';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtservice: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email already in use! Please try with a different email',
      );
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const newlyCreateUser = await this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.USER,
    });

    const savedUser = await this.userRepository.save(newlyCreateUser);

    const { password, ...result } = savedUser;

    return {
      user: result,
      message: 'Register successful! Please login to continue',
    };
  }

  async createAdmin(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException(
        'Email already in use! Please try with a diff eamil',
      );
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const newlyCreateUser = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const savedUser = await this.userRepository.save(newlyCreateUser);

    const { password, ...result } = savedUser;
    return {
      user: result,
      message: 'Admin user create successfully! Please login to continue',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException(
        'Invalid credentials or account not exists',
      );
    }

    // generate the tokens
    const tokens = this.generateTokens(user);
    const { password, ...result } = user;

    return {
      user: result,
      ...tokens,
    };
  }

  async refleshToken(refreshToken: string) {
    try{
        const payload = this.jwtservice.verify(refreshToken,{
            secret : 'refresh_secret'
        })

        const user = await this.userRepository.findOne({
            where : {id : payload.sub}
        })

        if (!user) {
            throw new UnauthorizedException ('Invalid token')
        }

        const accessToken = this.generateAccessToken(user);

        return {accessToken};
    } catch (e) {
        throw new UnauthorizedException('Invalid token')
    }

  }

  //find the current user by Id

  // find the current  user by Id

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateTokens(user: User) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: User): string {
    // -> email,sub (id),role -> vvvI -> RBAC -> user? Admin?
    const playload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return this.jwtservice.sign(playload, {
      secret: 'Jwt_secret',
      expiresIn: '15min',
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
    };
    return this.jwtservice.sign(payload, {
      secret: 'refresh_secret',
      expiresIn: '7d',
    });
  }
}
