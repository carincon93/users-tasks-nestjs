
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { Roles } from '@/roles/entities/roles.entity';

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 255 })
    username: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 255 })
    email: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 255 })
    @Exclude()
    password_hash: string;

    @Column({ type: 'varchar', nullable: true, length: 255 })
    @Exclude()
    refresh_token_hash?: string | null;

    @ManyToMany(type => Roles, roles => roles.users, { cascade: true })
    @JoinTable({ name: 'users_roles', joinColumn: { name: 'user_id', referencedColumnName: 'id' }, inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' } })
    roles: Roles[];
}
