import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class HasAuthorityGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user || [];
    console.log(request.user);
    
    if(!user.scopes) {
      throw new UnauthorizedException(`Account does not have any scope assigned`);
    }

    if (!this.matchRoles(roles, user.scopes)) {
      throw new UnauthorizedException(`Insufficient permissions to fetch any of required(${roles.join(',')}) scopes`);
    }
    return true;
  }

  matchRoles(actionRoles: string[], userRoles: string[]): boolean {
    return actionRoles.some(r => userRoles.includes(r));
  }
}

