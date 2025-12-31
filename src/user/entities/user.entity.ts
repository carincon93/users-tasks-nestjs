import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Task } from "src/task/entities/task.entity";
import { Role } from "@/role/entities/role.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 255 })
    username: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    passwordHash: string;

    @Column({ type: 'varchar', nullable: true, length: 255 })
    refreshTokenHash?: string | null;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @ManyToMany(() => Role, roles => roles.users, { cascade: true })
    @JoinTable({ name: 'users_roles', joinColumn: { name: 'user_id', referencedColumnName: 'id' }, inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' } })
    roles: Role[];
}