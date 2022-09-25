import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service';
import { AdminRole, userAdminRole, userRole } from '@/enum/roles';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const { id, type } = payload;
    if (!type) {
      return {
        ...await this.userService.findOneAdmin(id),
        type,
      }
    } else {
      const user = await this.userService.findOneUser(id)
      if (user.identity.id === 20) {
        throw new UnauthorizedException()
      }
      let _: any
      if ([
        userRole.LSH_CWFHZ,
        userRole.LSH_HZ,
        userRole.LSH_JSFHZ,
        userRole.LSH_ZGFZR
      ].includes(user.identity.id)) _ = AdminRole.president
      else if (userAdminRole.includes(user.identity.id)) _ = AdminRole.minister
      else _ = AdminRole.official
      const roles = await this.userService.getRolesById(_)
      return {
        ...user,
        type,
        roles
      }
    }
  }
}
