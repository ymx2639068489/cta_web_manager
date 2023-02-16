import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { NoAuth } from '@/common/decorators/Role/customize';
import { Roles } from '@/common/decorators/Role/roles.decorator';
import { Api } from '@/common/utils/api';
import { SetGxaScoreDto, GetAllGxaDto, GetFinalsTeamList, GxaDto, SetGxaNetworkScoreDto } from '@/dto/gxa';
import { activeName } from '@/enum/active-time';
import { AdminRole } from '@/enum/roles';
import { Body, Controller, Get, Param, Patch, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
  

  @Get('registeredList')
  @ApiOperation({ description: '获取当届所有已经报名了的队伍' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'content', required: false })
  @SwaggerPagerOk(GxaDto)
  async registeredList(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('content') content: string,
  ) {
    return await this.gxaService.findRegistered(
      (page - 1) * pageSize,
      pageSize,
      content
    );
  }

  @Get('getUnapprovedWork')
  @ApiOperation({ description: '获取需要审核的作品' })
  @SwaggerOk()
  async getUnapprovedWork() {
    if (!await this.activeTimeService.isActive(activeName.GXA_approve)) {
      return Api.err(-1, '当前不能初审');
    }
    return await this.gxaService.getUnapprovedWork()
  }

  @Get()
  @Roles(AdminRole.competition_scoring_teacher, AdminRole.root)
  @ApiOperation({ description: '获取所有初审通过了的作品列表，以供打分' })
  @SwaggerOk(GetAllGxaDto)
  async getAll(@Req() { user }: any) {
    if (!await this.activeTimeService.isActive(activeName.GXA_works_scoring)) {
      return Api.err(-1, '当前不能打分');
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
      return Api.err(-1, '当前未到打分环节、不能打分')
    }
    return this.gxaService.setScore(user, setGxaScoreDto);
  }

  @Get('getAllWorkAndScore')
  @ApiOperation({ description: '获取所有已打分的作品以及对应的成绩' })
  @SwaggerOk()
  async getAllScore() {
    return this.gxaService.getAllWorkAndScore()
  }

  // 初审
  @Patch('firstTrialGxaWork/:id/:status')
  @ApiOperation({ description: '初审, false: 如果之前是true, 则会被打回, true => 通过' })
  @ApiParam({ name: 'id', description: '国信安作业id' })
  @ApiParam({ name: 'status', description: 'false=> 打回, true => 通过'})
  @SwaggerOk()
  async firstTrialGxaWork(
    @Param('id') id: number,
    @Param('status') status: boolean
  ) {
    if (id == undefined || status === undefined) return Api.err(-1, 'error');
    if (!await this.activeTimeService.isActive(activeName.GXA_approve)) {
      return Api.err(-1, '当前不能初审');
    }
    return await this.gxaService.firstTrialGxaWork(id, status);
  }

  @Put('setnetworkScore')
  @ApiOperation({ description: '给指定id的作品打分' })
  @Roles(AdminRole.competition_scoring_teacher, AdminRole.root)
  @SwaggerOk()
  async setnetworkScore(@Body() setGxaNetworkScoreDto: SetGxaNetworkScoreDto) {
    if (!await this.activeTimeService.isActive(activeName.GXA_works_scoring)) {
      return Api.err(-1, '当前未到打分环节、不能打分')
    }
    return this.gxaService.setnetworkScore(setGxaNetworkScoreDto);
  }

  @Get('setFinallyList')
  @ApiOperation({ description: '一键设置决赛名单' })
  @Roles(AdminRole.root)
  @SwaggerOk()
  async setFinallyList() {
    if (!await this.activeTimeService.isActive(activeName.GXA_finals)) {
      return Api.err(-1, '当前未到打分环节、不能打分')
    }
    return this.gxaService.setFinallyList();
  }

  @Get('withdrawFinallyList')
  @ApiOperation({ description: '一键撤回决赛名单' })
  @Roles(AdminRole.root)
  @SwaggerOk()
  async withdrawFinallyList() {
    if (!await this.activeTimeService.isActive(activeName.GXA_finals)) {
      return Api.err(-1, '当前未到打分环节、不能打分')
    }
    return this.gxaService.withdrawFinallyList();
  }
}
