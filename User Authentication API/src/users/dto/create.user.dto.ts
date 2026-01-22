import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateUserDto{
    @IsNumber()
    id: number;

    @IsString()
    name : string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsArray()
    role : string[];

}