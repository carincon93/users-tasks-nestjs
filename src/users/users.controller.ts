import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/roles/guards/roles.guard';
import { Roles } from '@/roles/decorators/roles.decorator';
import { Role } from '@/roles/enums/role.enum';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.Admin)
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(): Promise<Users[]> {
        return await this.usersService.findAll();
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
        return await this.usersService.create(createUserDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Users | null> {
        return await this.usersService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<Users | null> {
        return await this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return await this.usersService.remove(id);
    }
}