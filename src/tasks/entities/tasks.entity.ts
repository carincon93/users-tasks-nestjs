import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tasks {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'boolean' })
    completed: boolean;

    @Column({ type: 'uuid' })
    user_id: string;
}