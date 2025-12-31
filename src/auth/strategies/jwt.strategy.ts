
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { User } from '@/user/entities/user.entity';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.access_token_secret')!,
        });
    }

    async validate(payload: { sub: string; email: string }): Promise<User> {
        const user = await this.authService.validateUser(payload);

        if (!user) {
            throw new UnauthorizedException({ message: 'Invalid user' });
        }

        return user;
    }
}