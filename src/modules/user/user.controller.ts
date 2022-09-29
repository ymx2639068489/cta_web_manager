import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { Roles } from '@/common/decorators/Role/roles.decorator';
import { Api } from '@/common/utils/api';
import { GetUserInfoDto, SetUserInfo } from '@/dto/users';
import { AdminRole } from '@/enum/roles';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @Roles(AdminRole.root, AdminRole.user_admin)
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'content', required: false })
  @SwaggerPagerOk(GetUserInfoDto)
  async findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('content') content: string
  ) {
    return await this.userService.findAllUser(page, pageSize, content)
  }

  @Patch('updateUserInfo')
  @Roles(AdminRole.root, AdminRole.user_admin)
  @ApiBody({ type: SetUserInfo })
  @SwaggerOk()
  async findOne(@Body() setUserInfo: SetUserInfo) {
    return await this.userService.setUserPassword(setUserInfo)
  }

  @Get('getOfficial')
  @ApiOperation({ description: '获取当届所有成员' })
  @SwaggerOk()
  async getOfficial() {
    return await this.userService.getOfficial()
  }

  @Delete(':id')
  @ApiOperation({ description: '根据id删除用户' })
  @Roles(AdminRole.root, AdminRole.user_admin)
  @SwaggerOk()
  async deleteItem(@Param('id') id: number) {
    await this.userService.deleteUserItem(id)
  }
}
