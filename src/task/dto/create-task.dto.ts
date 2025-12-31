import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({ example: "Task title" })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: "Task description" })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: false })
    @IsNotEmpty()
    @IsBoolean()
    completed: boolean;
}