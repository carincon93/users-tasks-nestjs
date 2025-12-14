import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';

import { Users } from "@/users/entities/users.entity";
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from "@/users/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        private configService: ConfigService
    ) { }

    async register(createUserDto: CreateUserDto): Promise<Users> {
        return this.usersService.create(createUserDto);
    }

    async login(username: string, password: string) {
        const user = await this.usersService.findOneByUsername({ email: username });

        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            throw new UnauthorizedException();
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateUserRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const access_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('jwt.access_token_secret'),
            expiresIn: this.configService.get('jwt.access_token_expires_in'),
        });

        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('jwt.refresh_token_secret'),
            expiresIn: this.configService.get('jwt.refresh_token_expires_in'),
        });

        return { access_token, refresh_token };
    }

    async updateUserRefreshToken(userId: string, refresh_token: string) {
        const refresh_token_hash = await bcrypt.hash(refresh_token, 10);
        await this.usersService.updateToken(userId, refresh_token_hash);
    }

    async refreshTokens(refreshToken: string) {
        const decoded = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get('jwt.refresh_token_secret'),
        });

        const user = await this.usersService.findOne(decoded.sub);
        if (!user || !user.refresh_token_hash) {
            throw new UnauthorizedException();
        }

        const isValid = await bcrypt.compare(refreshToken, user.refresh_token_hash);
        if (!isValid) {
            throw new UnauthorizedException();
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateUserRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }
}
