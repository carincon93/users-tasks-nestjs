import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

import { RoleGuard } from '@/role/guards/role.guard';
import { Roles } from '@/role/decorators/role.decorator';
import { Role } from '@/role/enums/role.enum';

import { User } from './entities/user.entity';

import { UserService } from './user.service'

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth('AccessTokenBearer')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.Admin)
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly usersService: UserService) { }

    @Get()
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.usersService.create(createUserDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User | null> {
        return await this.usersService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User | null> {
        return await this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return await this.usersService.remove(id);
    }
}