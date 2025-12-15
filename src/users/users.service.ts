import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

import { Users } from "./entities/users.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<Users> {
        const { password, ...userData } = createUserDto;
        return await this.usersRepository.save({
            ...userData,
            password_hash: await bcrypt.hash(password, 10),
        });
    }

    async findAll(): Promise<Users[]> {
        return await this.usersRepository.find({ relations: ['roles'] });
    }

    async findOne(id: string): Promise<Users | null> {
        return await this.usersRepository.findOne({ relations: ['roles'], where: { id } });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<Users | null> {
        const password_hash = updateUserDto.password ? await bcrypt.hash(updateUserDto.password, 10) : updateUserDto.password;

        await this.usersRepository.update(id, {
            username: updateUserDto.username,
            email: updateUserDto.email,
            password_hash: password_hash,
        });
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}