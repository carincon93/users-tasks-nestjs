import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { User } from "src/user/entities/user.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'boolean' })
    completed: boolean;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User, (user) => user.tasks)
    user: User;
}