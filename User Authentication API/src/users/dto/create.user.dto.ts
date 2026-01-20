import { IsArray, IsNumber, IsString } from "class-validator";


export class CreateUserDto{
    @IsNumber()
    id: number;

    @IsString()
    name : string;

    @IsString()
    email: string;

    @IsArray()
    role : string[];

}