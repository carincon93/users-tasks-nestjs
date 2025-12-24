import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import * as argon2 from 'argon2';

import { Users } from "@/users/entities/users.entity";
import { CreateUserDto } from "@/users/dto/create-user.dto";
import { Response } from 'express';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async register(createUserDto: CreateUserDto): Promise<Users> {
        const user = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
        if (user) {
            throw new UnauthorizedException({ message: 'User already exists' });
        }

        const { password, ...saferUserDto } = createUserDto;
        const hashedPassword = await argon2.hash(password);

        const userData = { ...saferUserDto, password_hash: hashedPassword, refresh_token_hash: null };
        return this.usersRepository.save(userData);
    }

    async login(user: Users, response: Response) {
        const {
            accessToken,
            refreshToken,
            refreshTokenExpires,
        } = await this.generateTokens(user.id, user.email);

        await this.updateUserRefreshToken(user.id, refreshToken);

        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'strict',
            expires: refreshTokenExpires,
            path: `${this.configService.get('api.prefix')}/auth/refresh`,
        });

        return {
            access_token: accessToken,
        };
    }

    async logout(user: Users, response: Response<any, Record<string, any>>) {
        await this.usersRepository.update(user.id, {
            refresh_token_hash: null,
        });
        response.clearCookie('refresh_token');
    }

    async refresh(user: Users, response: Response<any, Record<string, any>>) {
        return await this.login(user, response);
    }

    async validateUser(payload: { sub: string; email: string }) {
        const user = await this.usersRepository.findOne({ relations: ['roles'], where: { email: payload.email } });

        if (!user) {
            throw new Error('Invalid user');
        }

        return user;
    }

    async validatePassword(username: string, password: string) {
        const user = await this.usersRepository.findOne({ relations: ['roles'], where: { email: username } });

        if (!user || !(await argon2.verify(user.password_hash, password))) {
            throw new Error('Invalid credentials');
        }

        return user;
    }

    async verifyRefreshToken(refreshToken: string, userId: string) {
        try {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user || !user.refresh_token_hash) {
                throw new UnauthorizedException({ message: 'Invalid user' });
            }

            const isValid = await argon2.verify(user.refresh_token_hash!, refreshToken);
            if (!isValid) {
                throw new UnauthorizedException({ message: 'Invalid refresh token' });
            }

            return user;
        } catch (error) {
            throw new UnauthorizedException({ message: 'Invalid refresh token' });
        }
    }

    async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const accessTokenSeconds = parseInt(this.configService.get('jwt.access_token_expires_in') ?? '0', 10);
        const refreshTokenSeconds = parseInt(this.configService.get('jwt.refresh_token_expires_in') ?? '0', 10);

        const accessTokenExpires = new Date(Date.now() + accessTokenSeconds * 1000);
        const refreshTokenExpires = new Date(Date.now() + refreshTokenSeconds * 1000);

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('jwt.access_token_secret'),
            expiresIn: this.configService.get('jwt.access_token_expires_in'),
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('jwt.refresh_token_secret'),
            expiresIn: this.configService.get('jwt.refresh_token_expires_in'),
        });

        return { accessToken, refreshToken, accessTokenExpires, refreshTokenExpires };
    }

    async updateUserRefreshToken(userId: string, refreshToken: string) {
        const refreshTokenHash = await argon2.hash(refreshToken);
        await this.usersRepository.update(userId, {
            refresh_token_hash: refreshTokenHash,
        });
    }
}
