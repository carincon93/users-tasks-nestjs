import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, ILike, Repository } from "typeorm";

import { Tasks } from "./entities/tasks.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationTaskDto } from "./dto/pagination-task.dto";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Tasks)
        private tasksRepository: Repository<Tasks>,
    ) { }

    async findAll(query: PaginationTaskDto, userId: string): Promise<{ data: Tasks[], count: number }> {
        const where: FindOptionsWhere<Tasks> = {
            user_id: userId,
        };

        if (query.completed !== undefined) {
            where.completed = query.completed;
        }

        if (query.title) {
            where.title = ILike(`%${query.title}%`);
        }

        const count = await this.tasksRepository.count();
        const tasks = await this.tasksRepository.find({
            where,
            skip: query.offset || undefined,
            take: query.limit || undefined,
            order: {
                id: 'ASC',
            },
        });

        return {
            'data': tasks,
            'count': count
        };
    }

    async create(createTaskDto: CreateTaskDto, userId: string): Promise<Tasks> {
        const { title, description, completed } = createTaskDto;
        return await this.tasksRepository.save({
            title,
            description,
            completed,
            user_id: userId,
        });
    }

    async findOne(id: string, userId: string): Promise<Tasks | null> {
        return await this.tasksRepository.findOne({ where: { id, user_id: userId } });
    }

    async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Tasks | null> {
        const { title, description, completed } = updateTaskDto;
        await this.tasksRepository.update(id, {
            title,
            description,
            completed,
        });
        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.tasksRepository.delete({ id, user_id: userId });
    }
}