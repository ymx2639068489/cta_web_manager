import { Roles } from '@/common/decorators/Role/roles.decorator';
import { warpResponse } from '@/common/interceptors';
import { Result } from '@/common/interface/result';
import { RolesDto } from '@/dto/admin-user';
import { GetRouterNoChildrenDto, GetRouterDto } from '@/dto/routers';
import { AdminRole, userAdminRole, userRole } from '@/enum/roles';
import { Body, Controller, Get, Param, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { RoutersService } from './routers.service';
import { Roles as RolesEntity } from '@/entities/admin/roles.entity';
import { GetRolesDto, UpdateRoleDto } from '@/dto/roles';
import { Api } from '@/common/utils/api';
import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';

@ApiBearerAuth()
@ApiTags('routers')
@Controller('routers')
export class RoutersController {
  constructor(
    private readonly routersService: RoutersService,
    private readonly userService: UserService,
  ) {}

  @Get('getRoles')
  @Roles(AdminRole.root)
  @ApiOperation({ description: '获取所有的角色, data是一个数组' })
  @SwaggerPagerOk(GetRolesDto)
  async getRoles(): Promise<Result<GetRolesDto[]>> {
    return {
      code: 0,
      message: '获取成功',
      data: await this.userService.getRoles(),
    };
  }


  @Get('getRouterByRole/:role')
  @Roles(AdminRole.root)
  @ApiParam({ name: 'role' })
  @ApiOperation({ description: '获取role对应的路由' })
  @SwaggerPagerOk(GetRouterNoChildrenDto)
  async getRouterByRole(@Param('role') role: string) {
    const data = this.routersService.getRouterByRole(
      (await this.userService.getRoleByName(role)).routers
    )
    return {
      code: 0,
      message: '获取成功',
      data
    }
  }

  @Post('setRoleRouters')
  @Roles(AdminRole.root)
  @ApiOperation({ description: ''})
  @SwaggerOk()
  async setRoleRouters(@Body() updateRoleDto: UpdateRoleDto) {
    try {
      await this.routersService.setRoleRouter(
        await this.userService.getRoleByName(updateRoleDto.roleName),
        updateRoleDto.routers
      );
      return { code: 0, message: '修改成功' };
    } catch (err) {
      return { code: -1, message: err };
    }
  }

  @Get('menus')
  @ApiOperation({ description: '获取用户对应的路由' })
  @SwaggerPagerOk(GetRouterDto)
  async getMenus(@Req() { user }: any): Promise<Result<GetRouterDto>> {
    return await this.routersService.getMenus(user)
  }
  

}
