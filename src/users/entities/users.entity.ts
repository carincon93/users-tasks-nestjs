
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Roles } from '@/roles/entities/roles.entity';

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({ length: 255 })
    username: string;

    @ApiProperty()
    @Column({ length: 255 })
    email: string;

    @ApiProperty()
    @Column({ length: 255 })
    @Exclude()
    password_hash: string;

    @Column({ nullable: true })
    @Exclude()
    refresh_token_hash?: string;

    @ManyToMany(type => Roles, roles => roles.users, { cascade: true })
    @JoinTable({ name: 'users_roles', joinColumn: { name: 'user_id', referencedColumnName: 'id' }, inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' } })
    roles: Roles[];
}
