import { ConfigService } from "@nestjs/config";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Query, Controller, Body, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GetCurrentUser } from "@/auth/decorators/get-current-user.decorator";

import { Roles } from "@/role/decorators/role.decorator";
import { RoleGuard } from "@/role/guards/role.guard";
import { Role as RoleEnum } from "@/role/enums/role.enum";

import { User } from "@/user/entities/user.entity";

import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationTaskDto } from "./dto/pagination-task.dto";

import { TaskService } from "./task.service";
import { Task } from "./entities/task.entity";

import { pagination } from "@/utils/pagination"


@ApiBearerAuth('AccessTokenBearer')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(RoleEnum.Basic)
@ApiTags("Tasks")
@Controller('tasks')
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
        private readonly configService: ConfigService,
    ) { }

    @Get()
    async findAll(@Query() query: PaginationTaskDto, @GetCurrentUser() user: User): Promise<{ results: Task[], count: number, next: string | null, previous: string | null }> {
        const { data, count } = await this.taskService.findAll(query, user.id);

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
    async create(@Body() createTaskDto: CreateTaskDto, @GetCurrentUser() user: User): Promise<Task> {
        return await this.taskService.create(createTaskDto, user.id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @GetCurrentUser() user: User): Promise<Task | null> {
        return await this.taskService.findOne(id, user.id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetCurrentUser() user: User): Promise<Task | null> {
        return await this.taskService.update(id, updateTaskDto, user.id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @GetCurrentUser() user: User): Promise<void> {
        await this.taskService.remove(id, user.id);
    }
}