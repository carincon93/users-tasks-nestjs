import { ApiProperty } from "@nestjs/swagger";
import { LoginDto } from "./login.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDto extends LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;
}