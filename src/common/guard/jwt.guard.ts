import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    //    在这里取metadata中的no-auth，得到的会是一个bool
    const noAuth = this.reflector.get<number>('no-auth', context.getHandler());
    if (noAuth === 0) return true;
    const guard = JwtAuthGuard.getAuthGuard(noAuth);
    return guard.canActivate(context); // 执行所选策略Guard的canActivate方法
  }

//    根据NoAuth的t/f选择合适的策略Guard
  private static getAuthGuard(noAuth: number): IAuthGuard {
    if (noAuth === -1) return new (AuthGuard('local'))();
    return new (AuthGuard('jwt'))();
  }
}
