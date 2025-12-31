
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role as RoleEnum } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);


        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new UnauthorizedException({ message: 'Invalid user' });
        }

        const userRoles = user.roles.flatMap(role => role.name);

        if (userRoles.includes(RoleEnum.Admin)) {
            return true;
        }

        return requiredRoles.some((role) => userRoles.includes(role));

    }
}