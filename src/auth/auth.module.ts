import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { Users } from "@/users/entities/users.entity";

@Module({
    imports: [
        PassportModule,
        TypeOrmModule.forFeature([Users]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('jwt.access_token_secret'),
                signOptions: { expiresIn: config.get('jwt.access_token_expires_in') },
            }),
            inject: [ConfigService],
            global: true,
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshStrategy,

    ],
    exports: [AuthService],
})

export class AuthModule { }
