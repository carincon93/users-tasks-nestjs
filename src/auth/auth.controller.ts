import { Body, Post, UseGuards, Controller, ClassSerializerInterceptor, UseInterceptors, Res } from "@nestjs/common";
import type { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

import { CreateUserDto } from "@/users/dto/create-user.dto";
import { Users } from "@/users/entities/users.entity";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { GetCurrentUser } from "./decorators/get-current-user.decorator";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(
        @Body() createUserDto: CreateUserDto,
        @Res({ passthrough: true }) response: Response<any, Record<string, any>>
    ) {
        return await this.authService.register(createUserDto);
    }

    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(
        @GetCurrentUser() user: Users,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.login(user, response);
    }

    @ApiBearerAuth('AccessTokenBearer')
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(
        @GetCurrentUser() user: Users,
        @Res({ passthrough: true }) response: Response<any, Record<string, any>>
    ) {
        response.clearCookie('refresh_token');
        await this.authService.logout(user, response);
        return response.redirect('/');
    }

    @ApiBearerAuth('RefreshTokenBearer')
    @UseGuards(JwtRefreshAuthGuard)
    @Post('refresh')
    async refresh(
        @GetCurrentUser() user: Users,
        @Res({ passthrough: true }) response: Response<any, Record<string, any>>
    ) {
        return this.authService.refresh(user, response);
    }

}