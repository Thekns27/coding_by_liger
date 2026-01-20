import { Entity } from "typeorm";


@Entity()
export class  User{
    id: number;
    name : string;
    email: string;
    role : string[];
    createdAt: Date;
    updatedAt: Date;
}