import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class PaginationTaskDto {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ example: 0 })
    offset: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ example: 10 })
    limit: number;

    @IsOptional()
    @Transform(({ obj, key }) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
    })
    @IsBoolean()
    @ApiPropertyOptional({ example: false })
    completed: boolean;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: "Task title" })
    title: string;
}