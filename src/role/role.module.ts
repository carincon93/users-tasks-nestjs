import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "@/user/user.module";

import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { Role } from "./entities/role.entity";

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([Role])],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService]
})

export class RoleModule { }