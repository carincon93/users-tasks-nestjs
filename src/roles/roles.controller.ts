import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Roles as RolesEntity } from "./entities/roles.entity";
import { RolesService } from "./roles.service";
import { AuthGuard } from "@/auth/auth.guard";
import { RolesGuard } from "./roles.guard";
import { Role } from "./enums/role.enum";
import { Roles } from "./roles.decorator";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.Admin)
@ApiTags("Roles")
@Controller("roles")
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    async findAll(): Promise<RolesEntity[]> {
        return await this.rolesService.findAll();
    }

    @Post()
    async create(@Body() createRoleDto: CreateRoleDto): Promise<RolesEntity> {
        return await this.rolesService.create(createRoleDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<RolesEntity | null> {
        return await this.rolesService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RolesEntity | null> {
        return await this.rolesService.update(id, updateRoleDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return await this.rolesService.remove(id);
    }
}