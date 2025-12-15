
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { Users } from '@/users/entities/users.entity';

interface tokenPayload {
    sub: string;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => request.cookies?.access_token,
                (request) => request.signedCookies?.access_token,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.access_token_secret')!,
        });
    }

    async validate(payload: tokenPayload): Promise<Users> {
        const user = await this.authService.validateUser(payload.email, payload.sub);
        console.log("jwt.strategy", user);

        if (!user) {
            throw new UnauthorizedException({ message: 'Invalid user' });
        }
        return user;
    }
}
