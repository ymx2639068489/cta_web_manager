import { SwaggerOk } from '@/common/decorators';
import { NoAuth } from '@/common/decorators/Role/customize';
import { Roles } from '@/common/decorators/Role/roles.decorator';
import { SetGxaScoreDto, GetAllGxaDto, GetFinalsTeamList } from '@/dto/gxa';
import { activeName } from '@/enum/active-time';
import { AdminRole } from '@/enum/roles';
import { Body, Controller, Get, Param, Patch, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ActiveTimeService } from '../active-time/active-time.service';
import { GxaService } from './gxa.service';
@ApiTags('gxa')
@ApiBearerAuth()
@Controller('gxa')
export class GxaController {
  constructor(
    private readonly activeTimeService: ActiveTimeService,
    private readonly gxaService: GxaService,
  ) {}
  
  @Get()
  @Roles(AdminRole.competition_scoring_teacher, AdminRole.root)
  @ApiOperation({ description: '获取所有的作品表单，以供打分' })
  @SwaggerOk(GetAllGxaDto)
  async getAll(@Req() { user }: any) {
    if (
      !await this.activeTimeService.isActive(activeName.GXA_works_scoring) &&
      !await this.activeTimeService.isActive(activeName.GXA_approve)
    ) {
      return { code: -1, message: '当前不能审核' }
    }
    return this.gxaService.findWordAll(user);
  }

  @Put()
  @ApiOperation({ description: '给指定id的作品打分' })
  @Roles(AdminRole.competition_scoring_teacher, AdminRole.root)
  @SwaggerOk()
  async setScore(
    @Req() { user }: any,
    @Body() setGxaScoreDto: SetGxaScoreDto
  ) {
    if (!await this.activeTimeService.isActive(activeName.GXA_works_scoring)) {
      return { code: -1, message: '当前不能审核' };
    }
    return this.gxaService.setScore(user, setGxaScoreDto);
  }

  @Get('getAllWorkAndScore')
  @ApiOperation({ description: '获取所有作品的信息' })
  @Roles(AdminRole.root)
  @SwaggerOk()
  async getAllScore() {
    return this.gxaService.getAllWorkAndScore()
  }

  // 初审
  @Patch('firstTrialGxaWork/:id/:status')
  @ApiOperation({ description: '初审, false=> 拒绝， true => 通过' })
  @Roles(AdminRole.root, AdminRole.audit_gxa_admin)
  @ApiParam({ name: 'id', description: '国信安作业id' })
  @ApiParam({ name: 'status', description: 'false=> 拒绝， true => 通过'})
  @SwaggerOk()
  async firstTrialGxaWork(
    @Param('id') id: number,
    @Param('status') status: boolean
  ) {
    return await this.gxaService.firstTrialGxaWork(id, status)
  }

  @Get('getUnapprovedWork')
  @ApiOperation({ description: '获取所有未审核或拒绝的作品' })
  @SwaggerOk()
  @Roles(AdminRole.root, AdminRole.audit_gxa_admin)
  async getUnapprovedWork() {
    return await this.gxaService.getUnapprovedWork()
  }

  @NoAuth(0)
  @ApiOperation({ description: 'public 获取决赛名单' })
  @SwaggerOk(GetFinalsTeamList)
  async getFinalsTeamList() {
    if (!await this.activeTimeService.isActive(activeName.GXA_finals)) {
      return { code: -10, message: '未到时间'}
    }
    return await this.gxaService.getFinalsTeamList()
  }
}
