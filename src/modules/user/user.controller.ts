import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { Roles } from '@/common/decorators/Role/roles.decorator';
import { Api } from '@/common/utils/api';
import { GetUserInfoDto } from '@/dto/users';
import { AdminRole } from '@/enum/roles';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({ name: 'username', required: false })
  @SwaggerPagerOk(GetUserInfoDto)
  async findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('username') username: string
  ) {
    return await this.userService.findAllUser(page, pageSize, username)
  }

  @Get('findOne/:studentId')
  @Roles(AdminRole.root, AdminRole.user_admin)
  @ApiParam({ name: 'studentId' })
  @SwaggerOk(GetUserInfoDto)
  async findOne(@Param('studentId') studentId: string) {
    const _ = await this.userService.findOneByStudentId(studentId)
    if (_) return Api.ok(_)
    return Api.err(-1, 'user is not found')
  }

  @Get('getOfficial')
  @ApiOperation({ description: '获取当届所有成员' })
  @SwaggerOk()
  async getOfficial() {
    return await this.userService.getOfficial()
  }
}
