import { AdminUser } from '@/entities/admin';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MD5 } from 'crypto-js';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async findOne(studentId: string): Promise<AdminUser> {
    return this.userService.findOneByUsername(studentId);
  }
  async validateAdmin(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && user.password === MD5(pass).toString()) {
      return {
        id: user.id,
        type: false,
      };
    }
    return null;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsernameUser(username);
    if (user && user.password === MD5(pass).toString()) {
      return {
        id: user.id,
        type: true,
      };
    }
    return null;
  }
  login(user: any): string {
    return this.jwtService.sign(user);
  }
}
