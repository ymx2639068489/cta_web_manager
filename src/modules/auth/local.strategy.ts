import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Logger } from '@/common/utils/log4js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string, type: boolean): Promise<any> {
    if (!type) {
      console.log('type = ',type);
    }
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      Logger.error('有人账号密码错误')
      throw new UnauthorizedException()
    }
    return user;
  }
}
