import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorators';

/**
 * workflow ->
 * client ->  jwtauthguard ->  validate the token and attach the current user in the request
 * -> rolesguard check if current user role matches the required role -> if match found
 * proceed to controller -> if not forbidden exception
 */

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector -> utility that will help to access metadata
  constructor(private reflector: Reflector) {}

  // next method ->  router.post('/',A,B,C,handler)
  canActivate(context: ExecutionContext): boolean {
    // retrive the roles metadata set by the roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // method level metadata
        context.getClass(), // class level metadata
      ],
    );
    console.log('role guard first');
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hashRequiredRole = requiredRoles.some((role) => user.role === role);
    if (!hashRequiredRole) {
      throw new ForbiddenException('Insufficient permission');
    }
    console.log('role guard');
    return true;
  }
}
