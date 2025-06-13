import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { UserRole } from "../enum/userRole.enum";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    role?: UserRole;
}
