import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { Roles } from "./entities/roles.entity";
import { RolesGuard } from "./roles.guard";
import { UsersModule } from "@/users/users.module";

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([Roles])],
    controllers: [RolesController],
    providers: [
        RolesService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        }],
    exports: [RolesService]
})

export class RolesModule { }