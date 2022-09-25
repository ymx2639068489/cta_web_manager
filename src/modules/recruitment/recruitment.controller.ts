import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { Roles } from '@/common/decorators/Role/roles.decorator';
import { warpResponse } from '@/common/interceptors';
import { Result } from '@/common/interface/result';
import { Api } from '@/common/utils/api';
import { API_CODES } from '@/const/api.const';
import { GetRecruitmentDto } from '@/dto/recruitment';
import { activeName } from '@/enum/active-time';
import { RecruitmentStatus } from '@/enum/recruitment';
import { AdminRole, DepartmentEnum } from '@/enum/roles';
import { userAdminRole } from '@/enum/roles';
import { Controller, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActiveTimeService } from '../active-time/active-time.service';
import { RecruitmentService } from './recruitment.service';
const _roles: number[] = [
  ...userAdminRole,
  AdminRole.root,
  AdminRole.minister,
  AdminRole.president
]
@ApiBearerAuth()
@ApiTags('recruitment')
@Controller('recruitment')
export class RecruitmentController {
  constructor(
    private readonly recruitmentService: RecruitmentService,
    private readonly activeTimeService: ActiveTimeService,
  ) {}

  @Get('getAllDepartment')
  @ApiOperation({ description: '获取所有的部门' })
  @ApiResponse({
    schema: {
      allOf: [
        {
          properties: {
            code: {
              type: 'Number',
              default: 0
            }
          }
        },
        {
          properties: {
            message: {
              type: 'String',
              default: '成功'
            }
          }
        },
        {
          properties: {
            data: {
              allOf: [
                {
                  properties: {
                    departmentName: {
                      type: 'String',
                      default: '秘书处'
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    }
  })
  getAllDepartment() {
    return { data: DepartmentEnum, code: 0, message: '获取成功' };
  }

  @Get('getRecruitment')
  @Roles(..._roles)
  @ApiOperation({ description: '获取提交过来的干事申请表' })
  @ApiQuery({ name: 'department', description: '部门', enum: DepartmentEnum, required: false })
  @ApiQuery({ name: 'page', description: '页数' })
  @ApiQuery({ name: 'pageSize', description: '页面大小' })
  @ApiQuery({ name: 'status', enum: RecruitmentStatus })
  @ApiQuery({ name: 'content', required: false })
  @SwaggerPagerOk(GetRecruitmentDto)
  async getRecruitment(
    @Req() { user }: any,
    @Query('department') department: DepartmentEnum,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('status') status: string,
    @Query('content') content: string
  ): Promise<Result<GetRecruitmentDto>> {

    // 检查现在是不是可以审核申请表了
    if (!await this.activeTimeService.isActive(activeName.recruitment_interview_notice)) {
      return { code: -10, message: '不在活动时间范围内' }
    }

    // 检查当前用户的权限
    if (!this.recruitmentService.checkIndentity(user, department)) return {
      code: -1, message: '权限不够'
    }
    if (department) {
      console.log('111');
      return await this.recruitmentService.getAllByDepartment(
        content,
        department,
        +page,
        +pageSize,
        RecruitmentStatus[status]
      )
    } else {
      console.log('222');
      
      return await this.recruitmentService.getAll(
        content,
        +page,
        +pageSize,
        RecruitmentStatus[status]
      )
    }
  }

  @Patch('firstTrialRecruitment/:id/:status')
  @Roles(..._roles)
  @ApiOperation({ description: '传过来对应申请表的id, 初审此表, status=false为拒绝, true通过' })
  @ApiParam({ name: 'id', description: '申请表id' })
  @ApiParam({ name: 'status', description: '状态：false为拒绝， true为通过' })
  @SwaggerOk()
  async firstTrialRecruitment(
    @Req() { user }: any, 
    @Param('id') id: string,
    @Param('status') status: boolean
  ) {
    if (!await this.activeTimeService.isActive(activeName.recruitment_interview_notice)) {
      return { code: -10, message: '不在活动时间范围内' }
    }
    if (!await this.recruitmentService.checkAuth(user, +id)) return {
      code: -2, message: '权限不够'
    }
    return await this.recruitmentService.firstTrialRecruitment(user, +id, status);
  }

  @Patch('setOfficial/:id/:department')
  @Roles(..._roles)
  @ApiOperation({ description: '设置干事' })
  @ApiParam({ name: 'id', description: '申请表id' })
  @ApiParam({ name: 'department', enum: DepartmentEnum })
  @SwaggerOk()
  async setOfficial(
    @Param('department') department: DepartmentEnum,
    @Param('id') id: string,
  ) {
    if (!await this.activeTimeService.isActive(activeName.set_official)) {
      return { code: -10, message: '活动时间未到' }
    }
    return await this.recruitmentService.setOfficial(+id, department)
  }

  // @Get('findOne')
  // @ApiQuery({ name: 'content' })
  // @ApiQuery({ name: 'page' })
  // @ApiQuery({ name: 'pageSize' })
  // @ApiOperation({ description: '查询干事申请表' })
  // @ApiQuery({ name: 'status', enum: RecruitmentStatus })
  // @SwaggerPagerOk(GetRecruitmentDto)
  // async findOne(
  //   @Query('content') content: string,
  //   @Query('page') page: string,
  //   @Query('pageSize') pageSize: string,
  //   @Query('status') status: string,
  // ) {
  //   return this.recruitmentService.findOneByContent(
  //     content,
  //     +page,
  //     +pageSize,
  //     RecruitmentStatus[status]
  //   )
  // }

  @Roles(AdminRole.root)
  @Get('finallySendOffer')
  @ApiQuery({ name: 'id', description: '申请表id' })
  @ApiOperation({ description: '最终确定名单，获取预录取的名单，由root确定录取' })
  @SwaggerOk()
  async finallySendOffer(@Req() { user }: any, @Query('id') id: string) {
    if (!await this.activeTimeService.isActive(activeName.set_official)) {
      return { code: -10, message: '活动时间未到' }
    }
    return await this.recruitmentService.setOfficialFinally(+id)
  }

  @Get('getStatus')
  @ApiOperation({ description: '获取申请表状态列表' })
  @SwaggerOk()
  getStatus() {
    return Api.ok(RecruitmentStatus)
  }
}
