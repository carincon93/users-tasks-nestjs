import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, ILike, Repository } from "typeorm";

import { Task } from "./entities/task.entity";

import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationTaskDto } from "./dto/pagination-task.dto";

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) { }

    async findAll(query: PaginationTaskDto, userId: string): Promise<{ data: Task[], count: number }> {
        const where: FindOptionsWhere<Task> = {
            userId: userId,
        };

        if (query.completed !== undefined) {
            where.completed = query.completed;
        }

        if (query.title) {
            where.title = ILike(`%${query.title}%`);
        }

        const count = await this.taskRepository.count();
        const tasks = await this.taskRepository.find({
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

    async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
        const { title, description, completed } = createTaskDto;
        return await this.taskRepository.save({
            title,
            description,
            completed,
            userId: userId,
        });
    }

    async findOne(id: string, userId: string): Promise<Task | null> {
        return await this.taskRepository.findOne({ where: { id, userId: userId } });
    }

    async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task | null> {
        const { title, description, completed } = updateTaskDto;
        await this.taskRepository.update(id, {
            title,
            description,
            completed,
        });
        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.taskRepository.delete({ id, userId: userId });
    }
}