import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RolesGuard } from "@/roles/roles.guard";
import { Users } from "./entities/users.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    controllers: [UsersController],
    providers: [
        UsersService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [UsersService]
})

export class UsersModule { }