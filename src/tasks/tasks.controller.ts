import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Query, Controller, Body, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { Roles } from "@/roles/decorators/roles.decorator";
import { RolesGuard } from "@/roles/guards/roles.guard";
import { Role } from "@/roles/enums/role.enum";
import { Users } from "@/users/entities/users.entity";
import { GetCurrentUser } from "@/auth/decorators/get-current-user.decorator";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginateTaskDto } from "./dto/paginate-task.dto";
import { Tasks } from "./entities/tasks.entity";

@ApiBearerAuth('AccessTokenBearer')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.Basic)
@ApiTags("Tasks")
@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
    ) { }

    @Get()
    async findAll(@Query() query: PaginateTaskDto, @GetCurrentUser() user: Users): Promise<Tasks[]> {
        return await this.tasksService.findAll(query, user.id);
    }

    @Post()
    async create(@Body() createTaskDto: CreateTaskDto, @GetCurrentUser() user: Users): Promise<Tasks> {
        return await this.tasksService.create(createTaskDto, user.id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @GetCurrentUser() user: Users): Promise<Tasks | null> {
        return await this.tasksService.findOne(id, user.id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetCurrentUser() user: Users): Promise<Tasks | null> {
        return await this.tasksService.update(id, updateTaskDto, user.id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @GetCurrentUser() user: Users): Promise<void> {
        await this.tasksService.remove(id, user.id);
    }
}
