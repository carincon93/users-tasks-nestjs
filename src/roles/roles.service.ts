import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Roles } from "./entities/roles.entity";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Roles)
        private rolesRepository: Repository<Roles>,
    ) { }


    async create(createRoleDto: CreateRoleDto): Promise<Roles> {
        return await this.rolesRepository.save(createRoleDto);
    }

    async findAll(): Promise<Roles[]> {
        return await this.rolesRepository.find();
    }

    async findOne(id: string): Promise<Roles | null> {
        return await this.rolesRepository.findOneBy({ id });
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Roles | null> {
        await this.rolesRepository.update(id, updateRoleDto);
        return await this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.rolesRepository.delete(id);
    }
}
