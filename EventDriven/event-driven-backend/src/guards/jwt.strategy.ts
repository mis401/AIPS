import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtSecret } from "../utils/constants";

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JwtSecret
        })
    }

    async validate(payload: any){
        console.log(payload.sub + " " + payload.role);
        return {userId: payload.sub, user: payload.user, role: payload.role};
    }
}