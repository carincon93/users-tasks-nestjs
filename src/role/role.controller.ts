import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";

import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

import { Role } from "./entities/role.entity";
import { RoleService } from "./role.service";

import { Roles } from "./decorators/role.decorator";
import { RoleGuard } from "./guards/role.guard";
import { Role as RoleEnum } from "./enums/role.enum";

@ApiBearerAuth('AccessTokenBearer')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(RoleEnum.Admin)
@ApiTags("Roles")
@Controller("roles")
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Get()
    async findAll(): Promise<Role[]> {
        return await this.roleService.findAll();
    }

    @Post()
    async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return await this.roleService.create(createRoleDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Role | null> {
        return await this.roleService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<Role | null> {
        return await this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return await this.roleService.remove(id);
    }
}