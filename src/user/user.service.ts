import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as argon2 from 'argon2';

import { User } from "./entities/user.entity";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { password, ...userData } = createUserDto;
        return await this.usersRepository.save({
            ...userData,
            passwordHash: await argon2.hash(password),
        });
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find({ relations: ['roles'] });
    }

    async findOne(id: string): Promise<User | null> {
        return await this.usersRepository.findOne({ relations: ['roles'], where: { id } });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        const password_hash = updateUserDto.password ? await argon2.hash(updateUserDto.password) : updateUserDto.password;

        await this.usersRepository.update(id, {
            username: updateUserDto.username,
            email: updateUserDto.email,
            passwordHash: password_hash,
        });
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}