import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TasksService } from "./tasks.service";
import { TasksController } from "./tasks.controller";
import { Tasks } from "./entities/tasks.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Tasks])],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule { }