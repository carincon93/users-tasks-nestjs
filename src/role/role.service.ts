import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

import { Role } from "./entities/role.entity";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) { }

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        return await this.rolesRepository.save(createRoleDto);
    }

    async findAll(): Promise<Role[]> {
        return await this.rolesRepository.find();
    }

    async findOne(id: string): Promise<Role | null> {
        return await this.rolesRepository.findOneBy({ id });
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
        await this.rolesRepository.update(id, updateRoleDto);
        return await this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.rolesRepository.delete(id);
    }
}