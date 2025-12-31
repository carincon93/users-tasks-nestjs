import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "@/user/entities/user.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToMany(() => User, users => users.roles)
    users: User[];
}