import { SwaggerOk } from '@/common/decorators';
import { activeName } from '@/enum/active-time';
import { Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActiveTimeService } from '../active-time/active-time.service';
import { NewbornAlgoirthmService } from './newborn-algoirthm.service';

@ApiBearerAuth()
@ApiTags('newborn-algoirthm')
@Controller('newborn-algoirthm')
export class NewbornAlgoirthmController {
  constructor(
    private readonly newbornService: NewbornAlgoirthmService,
    private readonly activeService: ActiveTimeService,
  ) {}
  private async isActive(): Promise<boolean> {
    return this.activeService.isActive(activeName.newborn_algorithm_competition)
  }
  @Get()
  @ApiOperation({ description: '获取所有报名的同学列表' })
  @SwaggerOk()
  async create() {
    if (!await this.isActive()) {
      return { code: -10, message: '未到报名时间' }
    }
    return await this.newbornService.findAll()
  }
}
