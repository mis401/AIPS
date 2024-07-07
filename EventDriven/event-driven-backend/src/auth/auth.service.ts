import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import *  as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
import { JwtSecret, JwtRefreshSecret } from '../utils/constants'
import { Response } from 'express';
import { Request } from 'express';
 
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async signup(dto: SignUpDto) {
        
        const { firstName, lastName, email, password } = dto;

        const foundUser = await this.prisma.user.findUnique({where:{email}})

        if(foundUser){
            throw new BadRequestException('Email already exists')
        }
        
        const hashedPassword = await this.hashPassword(password)
        await this.prisma.user.create({
            data: {
                email,
                hashedPassword,
                firstName,
                lastName
            }
        })

        return {message: 'signup was successful'};
    }

    async signin(foundUser, res: Response){

        //sign jwt and return to the user
        const {token, refreshToken} = await this.signTokens(
            {
                id: foundUser.id, 
                email: foundUser.email
            });

        if( !token || !refreshToken){
            throw new ForbiddenException()
        }

        res.cookie('token', token, {httpOnly: true, secure: true});
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true});
        
        return res.send({
            user: foundUser,
        });
    }

    async singout(req: Request, res:Response) {
        res.clearCookie('token', {httpOnly: true, secure: true});
        res.clearCookie('refreshToken', {httpOnly: true, secure: true});

        return res.send({message: 'Logged out successfully'})
    }

    async hashPassword(password: string){
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds)
    }

    async comparePasswords(args: {password:string , hash:string}){
        return await bcrypt.compare(args.password, args.hash);
    }

    async signTokens(args: {id:number, email:string}){
        const payload = args

        const token =  this.jwt.signAsync(payload, {secret: JwtSecret, expiresIn: '15min'});
        const refreshToken = this.jwt.signAsync(payload, {secret: JwtRefreshSecret, expiresIn: '7d'});

        return {token, refreshToken};
    }

    async refreshTokens(refreshToken: string, res: Response) {
        try {
            const payload = await this.jwt.verifyAsync(refreshToken, { secret: JwtRefreshSecret });

            const { token, refreshToken: newRefreshToken } = await this.signTokens({ id: payload.id, email: payload.email });

            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); //dali treba secure
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            return { token, refreshToken: newRefreshToken };
        } catch (e) {
            throw new ForbiddenException('Invalid refresh token');
        }
    }

    async validateUser(email:string, password: string) {
        console.log("Auth service validating");
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        console.log("User found");

        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            const {hashedPassword, ...result} = user;
            return result;
        }
        console.log("validation failed");
        return null;
    }
      
}
