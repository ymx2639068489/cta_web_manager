import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { NoAuth } from '@/common/decorators/Role/customize';
import { Roles } from '@/common/decorators/Role/roles.decorator';
import { getUserInfoDto } from '@/dto/users';
import { AdminRole } from '@/enum/roles';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @SwaggerPagerOk(getUserInfoDto)
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
  @SwaggerOk(getUserInfoDto)
  async findOne(@Param('studentId') studentId: string) {
    return await this.userService.findOneByStudentId(studentId)
  }

  @Get('getOfficial')
  // @NoAuth(0)
  @SwaggerOk()
  async getOfficial() {
    return await this.userService.getOfficial()
  }
}
