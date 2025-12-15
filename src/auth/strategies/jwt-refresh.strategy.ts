import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

import { AuthService } from "../auth.service";

interface tokenPayload {
    sub: string;
    email: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private readonly configService: ConfigService, private readonly authServices: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => request.cookies?.refresh_token,
                (request) => request.signedCookies?.refresh_token,
            ]),
            secretOrKey: configService.get<string>('jwt.refresh_token_secret')!,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: tokenPayload) {
        console.log("jwt-refresh.strategy");

        return this.authServices.verifyRefreshToken(req.cookies.refresh_token, payload.sub);
    }
}