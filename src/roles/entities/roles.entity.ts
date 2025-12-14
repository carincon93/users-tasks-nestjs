import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { Users } from "@/users/entities/users.entity";

@Entity('roles')
export class Roles {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({ length: 255 })
    name: string;

    @ManyToMany(type => Users, users => users.roles)
    users: Users[];
}
