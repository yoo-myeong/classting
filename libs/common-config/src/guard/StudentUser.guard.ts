import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class StudentUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const token = req.headers.Authorization ?? req.headers.authorization;
    if (!token) return false;

    req.user = {
      id: 1,
    };

    return true;
  }
}
