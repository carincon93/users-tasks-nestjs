import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Tasks } from "./entities/tasks.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginateTaskDto } from "./dto/paginate-task.dto";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Tasks)
        private tasksRepository: Repository<Tasks>,
    ) { }

    async findAll(query: PaginateTaskDto, userId: string): Promise<Tasks[]> {
        return await this.tasksRepository.find({ where: { user_id: userId }, skip: query.skip, take: query.limit });
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