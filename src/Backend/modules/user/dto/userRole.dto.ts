import { IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "../enum/userRole.enum";

export class UserRoleDto {
    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;
}