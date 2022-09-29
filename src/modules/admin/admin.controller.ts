import {
  AdminUserLoginDto,
  AllAdminUserDto,
  CreateAdminDto,
  GetAdminUserDto,
  GetInfo,
  UpdateAdminSelfInfoDto
} from '@/dto/admin-user';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { NoAuth } from '@/common/decorators/Role/customize';
import { Result } from '@/common/interface/result';
import { Roles } from '@/common/decorators/Role/roles.decorator';
import { AdminRole } from '@/enum/roles';
import { AdminService } from './admin.service';
import { UserService } from '../user/user.service';
import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators/swagger.decorator';
import { SetAdminPasswordDto } from '@/dto/admin-user'
@ApiBearerAuth()
@ApiTags('admin_user')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  // 用户登录
  @NoAuth(0)
  @SwaggerOk(String)
  @Post('login')
  @ApiOperation({ description: '管理员登录' })
  async login(
    @Body() _adminUserLoginDto: AdminUserLoginDto
  ): Promise<Result<string>> {
    return this.adminService.login(_adminUserLoginDto)
  }

  @Get('getUserInfo')
  @SwaggerOk(GetInfo)
  @ApiOperation({ description: '获取用户信息' })
  async getInfo(@Req() { user }: any): Promise<Result<GetInfo>> {
    return { code: 0, message: '', data: user }
  }

  @SwaggerOk()
  @Put('updateSelfInfo')
  @ApiOperation({ description: '更新自己的信息' })
  async updateSelfInfo(
    @Req() { user }: any,
    @Body() updateAdminSelfInfoDto: UpdateAdminSelfInfoDto
  ): Promise<Result<string>> {
    if (user.type) return { code: -1, message: '当前不是管理员' }
    return this.userService.updateAdminSelfInfo(user, updateAdminSelfInfoDto)
  }

  @SwaggerOk()
  @Post('createAdmin')
  @Roles(AdminRole.root)
  @ApiOperation({ description: '创建一个管理员' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<Result<string>> {
    return this.adminService.createAdmin(createAdminDto)
  }

  @Get('getAllAdmin')
  @Roles(AdminRole.root)
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'username', required: false })
  @ApiOperation({ description: '获取所有管理员' })
  @ApiQuery({ name: 'roles', isArray: true, description: '角色id' })
  @SwaggerPagerOk(GetAdminUserDto)
  async getAllAdmin(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('roles') roles: AdminRole[],
    @Query('username') username: string,
  ): Promise<Result<AllAdminUserDto>> {
    return this.userService.getAllAdmin(+page, +pageSize, roles, username)
  }

  @SwaggerOk()
  @Roles(AdminRole.root)
  @Patch('setAdminPassword')
  @ApiOperation({ description: '更改管理员密码' })
  async setAdminPasswordInterface(
    @Body() setAdminPasswordDto: SetAdminPasswordDto
  ): Promise<Result<string>> {
    return this.userService.setAdminPassword(setAdminPasswordDto)
  }

  @SwaggerOk()
  @Roles(AdminRole.root)
  @ApiParam({ name: 'id' })
  @Delete('deleteAdmin/:id')
  @ApiOperation({ description: '通过id删除用户' })
  async deleteAdmin(@Param('id') id: string) {
    return await this.userService.deleteAdmin(id)
  }
}