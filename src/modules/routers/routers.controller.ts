import { Roles } from '@/common/decorators/Role/roles.decorator';
import { Result } from '@/common/interface/result';
import { GetRouterNoChildrenDto, GetRouterDto } from '@/dto/routers';
import { AdminRole } from '@/enum/roles';
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { GetRolesDto, UpdateRoleRouterDto, UpdateRoleInfoDto, CreateRoleDto } from '@/dto/roles';
import { Api } from '@/common/utils/api';
import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';

@ApiBearerAuth()
@ApiTags('routers')
@Controller('routers')
export class RoutersController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('getRoles')
  @Roles(AdminRole.root)
  @ApiOperation({ description: '获取所有的角色, data是一个数组' })
  @SwaggerPagerOk(GetRolesDto)
  async getRoles(): Promise<Result<GetRolesDto[]>> {
    const list = await this.userService.getRoles();
    return Api.ok(list);
  }


  @Get('getRouterByRole/:role')
  @Roles(AdminRole.root)
  @ApiParam({ name: 'role' })
  @ApiOperation({ description: '获取role(ID)对应的路由' })
  @SwaggerPagerOk(GetRouterNoChildrenDto)
  async getRouterByRole(@Param('role') roleId: number) {
    const router = (await this.userService.getRolesById(roleId)).routers;
    if (router) return Api.ok(JSON.parse(router))
    return Api.ok([]);
  }

  @Post('setRoleRouters')
  @Roles(AdminRole.root)
  @ApiOperation({ description: '设置路由，' })
  @SwaggerOk()
  async setRoleRouters(@Body() updateRoleDto: UpdateRoleRouterDto) {
    updateRoleDto.routers = JSON.stringify(updateRoleDto.routers);
    return this.userService.setRole(updateRoleDto);
  }

  @Get('menus')
  @ApiOperation({ description: '获取用户对应的路由' })
  @SwaggerPagerOk(GetRouterDto)
  async getMenus(@Req() { user }: any): Promise<Result<string>> {
    if (user.roles.routers) return Api.ok(JSON.parse(user.roles.routers))
    return Api.ok([]);
  }
  
  @Put('updateRoleInfo')
  async updateRole(@Body() updateRoleInfoDto: UpdateRoleInfoDto) {
    return await this.userService.updateRolesInfo(updateRoleInfoDto);
  }
  @Post('createRoles')
  async createRoles(@Body() createRolesDto: CreateRoleDto) {
    const item = await this.userService.getRoleByName(createRolesDto.roleName);
    if (item) return Api.err(-1, '角色名重复');
    await this.userService.createRoles(createRolesDto);
    return Api.ok();
  }
  @Delete('deleteRoles/:roleId')
  async deleteRoles(@Param('roleId') roleId: number) {
    if (roleId <= 31) return Api.err(-1, '基本角色不允许被删除');
    const item = await this.userService.getRolesById(roleId);
    if (!item) return Api.err(-2, '角色不存在');
    await this.userService.deleteRoles(roleId);
    return Api.ok()
  }
}
