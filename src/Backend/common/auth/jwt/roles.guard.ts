import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'modules/user/enum/userRole.enum';
import { ROLES_KEY } from 'roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Eğer rol belirtilmediyse, herkese izin ver
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('User Role:', user.role);
    
    if (!user) {
      return false;
    }
    console.log('User Role:', user.role);
    console.log('Required Roles:', requiredRoles);
    console.log('Authenticated User:', user);
    return requiredRoles.some((role) => user.role === role); // Kullanıcı rolü eşleşirse izin ver
  }
}
