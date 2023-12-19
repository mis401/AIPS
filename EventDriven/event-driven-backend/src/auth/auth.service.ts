import { BadRequestException, ForbiddenException, Injectable, Post } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import *  as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
import { JwtSecret } from '../utils/constants'
import { Response } from 'express';
import { Request } from 'express';
 
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async signup(dto: AuthDto) {
        const {email, password} = dto;

        const foundUser = await this.prisma.user.findUnique({where:{email}})

        if(foundUser){
            throw new BadRequestException('Email already exists')
        }
        const hashedPassword = await this.hashPassword(password)

        await this.prisma.user.create({
            data: {
                email,
                hashedPassword
            }
        })

    return {message: 'signup was successful'};
    }

    async signin(dto: AuthDto, req: Request, res: Response){
        const {email,password} = dto;

        const foundUser = await this.prisma.user.findUnique({where:{email}})
        if(!foundUser){
            throw new BadRequestException('Wrong credentials')
        }

        const isMatch = await this.comparePasswords(
            {
                password, 
                hash: foundUser.hashedPassword
            });
        if(!isMatch){
            throw new BadRequestException('Wrong credentials')
        }

        //sign jwt and return to the user
        const token = await this.signToken(
            {
                id: foundUser.id, 
                email: foundUser.email
            });

        if( !token){
            throw new ForbiddenException()
        }

        res.cookie('token', token);
        
        return res.send({message: 'Logged in successfully'});
    }

    async singout(req: Request, res:Response) {
        res.clearCookie('token');
        return res.send({message: 'Logged out successfully'})
    }

    async hashPassword(password: string){
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds)
    }

    async comparePasswords(args: {password:string , hash:string}){
        return await bcrypt.compare(args.password, args.hash);
    }

    async signToken(args: {id:number, email:string}){
        const payload = args

        return this.jwt.signAsync(payload, {secret: JwtSecret})
    }
}
