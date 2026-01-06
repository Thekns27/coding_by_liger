import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Name is required! Please provide name' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at lease 3 character long' })
  @MaxLength(50, { message: 'Name can not be longer than 50 characters' })
  name: string;

  @IsNotEmpty({ message: 'Password is required! Please provide password' })
  @MinLength(6, { message: 'Password must be at lease 6 character long' })
  password: string;
}
