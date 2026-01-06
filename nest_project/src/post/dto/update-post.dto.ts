

import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";



export class UpdatePostDto {
    @Optional()
    @IsNotEmpty({message: 'Title is required!'})
    @IsString ({message : 'Title must be a stream!'})
    @MinLength(3,{message : 'Title must be at least 3 characters long'})
    @MaxLength(50,{message: 'Tetle can not be longer than 50 characters'})
    title?: string;

    @Optional()
    @IsNotEmpty({message: 'Content is required!'})
    @IsString ({message : 'Content must be a stream!'})
    @MinLength(5,{message : 'Content must be at least 5 characters long'})
    content?: string

    @Optional()
    @IsNotEmpty({message: 'Author is required!'})
    @IsString ({message : 'Author must be a stream!'})
    @MinLength(2,{message : 'Author must be at least 2 characters long'})
    @MaxLength(25,{message: 'Author can not be longer than 50 characters'})
    authorName?: string;
}