import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { Roles } from '@/common/decorators/Role/roles.decorator';
import { activeName } from '@/enum/active-time';
import { AdminRole } from '@/enum/roles';
import { Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ActiveTimeService } from './active-time.service';
import { ActiveTimeDto } from '@/dto/active-time';

@ApiBearerAuth()
@ApiTags('active-time')
@Controller('active-time')
export class ActiveTimeController {
  constructor(
    private readonly activeTimeService: ActiveTimeService
  ) {}
  
  @Get('getAllActiveList')
  @Roles(AdminRole.root)
  @ApiOperation({ description: '获取所有活动列表' })
  @SwaggerPagerOk(ActiveTimeDto)
  async getAllActiveList() {
    return this.activeTimeService.getAllActiveList()
  }

  @Patch('setStartTime/:activeName/:date')
  @Roles(AdminRole.root)
  @ApiOperation({ description: '设置活动开始时间' })
  @ApiParam({ name: 'activeName' })
  @ApiParam({ name: 'date' })
  @SwaggerOk()
  async setStartTime(
    @Param('activeName') activeName: string,
    @Param('date') date: number
  ) {
    return await this.activeTimeService.setStartTime(activeName, date)
  }

  @Patch('setEndTime/:activeName/:date')
  @Roles(AdminRole.root)
  @ApiOperation({ description: '设置活动结束时间' })
  @ApiParam({ name: 'activeName' })
  @ApiParam({ name: 'date' })
  @SwaggerOk()
  async setEndTime(
    @Param('activeName') activeName: string,
    @Param('date') date: number,
  ) {
    return await this.activeTimeService.setEndTime(activeName, date)
  }
}
