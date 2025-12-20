import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class PaginateTaskDto {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ example: 0 })
    skip: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ example: 10 })
    limit: number;
}