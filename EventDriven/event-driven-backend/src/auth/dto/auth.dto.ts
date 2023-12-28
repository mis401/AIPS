import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class AuthDto {
    @IsNotEmpty({ message: 'First name is required' })
    @IsString()
    public firstName: string;

    @IsNotEmpty({ message: 'Last name is required' })
    @IsString()
    public lastName: string;

    @IsEmail({}, { message: 'Invalid email format' })
    public email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
    public password: string;

    @IsNotEmpty({ message: 'Confirm password is required' })
    @IsString()
    public confirmPassword: string;
}
