import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { Roles } from "./entities/roles.entity";
import { UsersModule } from "@/users/users.module";

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([Roles])],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesService]
})

export class RolesModule { }