import { ApiBearerAuth, ApiTags, refs } from "@nestjs/swagger";
import { Query, Controller, Body, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { Roles } from "@/roles/decorators/roles.decorator";
import { RolesGuard } from "@/roles/guards/roles.guard";
import { Role } from "@/roles/enums/role.enum";
import { Users } from "@/users/entities/users.entity";
import { GetCurrentUser } from "@/auth/decorators/get-current-user.decorator";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationTaskDto } from "./dto/pagination-task.dto";
import { TasksService } from "./tasks.service";
import { Tasks } from "./entities/tasks.entity";
import { pagination } from "@/utils/pagination"
import { ConfigService } from "@nestjs/config";

@ApiBearerAuth('AccessTokenBearer')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.Basic)
@ApiTags("Tasks")
@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
        private readonly configService: ConfigService,
    ) { }

    @Get()
    async findAll(@Query() query: PaginationTaskDto, @GetCurrentUser() user: Users): Promise<{ results: Tasks[], count: number, next: string | null, previous: string | null }> {
        const { data, count } = await this.tasksService.findAll(query, user.id);

        const apiUrl = this.configService.get<string>('api.url');
        const apiPort = this.configService.get<string>('api.port');
        const apiPrefix = this.configService.get<string>('api.prefix');

        const { next, previous } = pagination(query.offset, query.limit, count);

        return {
            count: count,
            next: next ? `${apiUrl}:${apiPort}${apiPrefix}/tasks?offset=${next.offset}&limit=${next.limit}` : null,
            previous: previous ? `${apiUrl}:${apiPort}${apiPrefix}/tasks?offset=${previous.offset}&limit=${previous.limit}` : null,
            results: data,
        };
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
