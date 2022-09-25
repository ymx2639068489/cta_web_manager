import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { NoAuth } from '@/common/decorators/Role/customize';
import { Roles } from '@/common/decorators/Role/roles.decorator';
import { GetFormerCadres, userInfoListDto } from '@/dto/admin-user';
import { activeName } from '@/enum/active-time';
import { AdminRole, cadresRole } from '@/enum/roles';
import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ActiveTimeService } from '..';
import { ReplacementService } from './replacement.service';

@ApiTags('replacement')
@ApiBearerAuth()
@Controller('replacement')
export class ReplacementController {
  constructor(
    private readonly replacementService: ReplacementService,
    private readonly activeTimeService: ActiveTimeService
  ) {}

  @Get()
  @Roles(AdminRole.root)
  @ApiOperation({ description: '换届，把之前的所有干部入库，同时取消他们的身份, 降级为会员'})
  @SwaggerOk()
  async termEnd() {
    if (!await this.activeTimeService.isActive(activeName.termEnd)) {
      return { code: -10, message: '换届尚未开始' }
    }
    return await this.replacementService.termEnd()
  }

  @NoAuth(0)
  @Get('getAllCadres')
  @ApiOperation({ description: '获取当届的干部, public' })
  @SwaggerPagerOk(userInfoListDto)
  async getAllCadres() {
    return await this.replacementService.getAllCadres()
  }

  @NoAuth(0)
  @Get('getFormerCadres/:session')
  @ApiParam({ name: 'session' })
  @ApiOperation({ description: '获取往届干部， public' })
  @SwaggerPagerOk(GetFormerCadres)
  async getFormerCadres(@Param('session') session: string) {
    return await this.replacementService.getFormerCadres(+session)
  }

  @Patch('setCadres')
  @Roles(AdminRole.root)
  @ApiOperation({ description: '设置干部' })
  @ApiQuery({ name: 'studentId', description: '用户的学号' })
  @ApiQuery({ name: 'role', enum: cadresRole, description: '干部列表' })
  @SwaggerOk()
  async setCadres(
    @Query('studentId') studentId: string,
    @Query('role') role: string
  ) {
    if (!await this.activeTimeService.isActive(activeName.termEnd)) {
      return { code: -10, message: '换届尚未开始' }
    }
    return await this.replacementService.setCadres(studentId, role)
  }
}
