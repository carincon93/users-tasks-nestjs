import { Body, Post, UseGuards, Controller, ClassSerializerInterceptor, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { Public } from "@/auth/auth.decorator";
import { CreateUserDto } from "@/users/dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto);
    }

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto.email, loginDto.password);
    }

    @Public()
    @ApiBody({ schema: { type: 'object', properties: { refresh_token: { type: 'string' } } } })
    @Post('refresh')
    async refresh(@Body() body: { refresh_token: string }) {
        return this.authService.refreshTokens(body.refresh_token);
    }

}