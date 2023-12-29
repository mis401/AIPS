import { Community, Role } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class FullUserInfo {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsNumber()
    id: number
    
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    role: Role

    @IsArray()
    managingCommunities: Community[]
}