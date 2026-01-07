import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email!' })
  email: string;

  @IsNotEmpty({ message: 'Name is required ! Please provide name' })
  @MinLength(6, { message: 'Name must be at least 6 characters long' })
  password: string;
}
