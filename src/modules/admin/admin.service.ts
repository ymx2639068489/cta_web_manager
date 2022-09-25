import { Result } from '@/common/interface/result';
import { AdminUserLoginDto, CreateAdminDto } from '@/dto/admin-user';
import { AdminRole } from '@/enum/roles';

import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { MD5 } from 'crypto-js';
@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 登录
  async login(_adminUserLoginDto: AdminUserLoginDto): Promise<Result<string>> {
    let data: any;
    const { username, password } = _adminUserLoginDto;
    if (_adminUserLoginDto.type) {
      const user = await this.authService.validateUser(username, password);
      if (user) return { code: 0, message: '', data: this.authService.login(user) };
      return { code: -1, message: '账号密码错误' };
    } else {
      const user = await this.authService.validateAdmin(username, password);
      if (user) return { code: 0, message: '', data: this.authService.login(user) };
      return { code: -1, message: '账号密码错误'};
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Result<string>> {
    if (createAdminDto.roles === AdminRole.root) {
      return { code: -1, message: '不允许设置最高权限' };
    }
    // 如果查到了这个管理员
    if (await this.userService.findOneByUsername(createAdminDto.username)) {
      return { code: -2, message: '用户已被注册' };
    }
    createAdminDto.password = MD5(createAdminDto.password).toString()
    try {
      await this.userService.createAdmin(createAdminDto)
      return { code: 0, message: '创建成功' };
    } catch (err) {      
      return { code: -3, message: err.message }
    }
  }
}
