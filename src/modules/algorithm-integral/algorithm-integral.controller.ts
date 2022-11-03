import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { NoAuth } from '@/common/decorators/Role/customize';
import { CreateIntegral, UpdateIntegral } from '@/dto/algorithm-integral';
import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AlgorithmIntegralService } from './algorithm-integral.service';

@ApiTags('algorithmIntegral')
@ApiBearerAuth()
@Controller('algorithm-integral')
export class AlgorithmIntegralController {
  constructor(
    private readonly integralService: AlgorithmIntegralService
  ) {}

  @Post()
  @ApiBody({ type: CreateIntegral })
  @ApiOperation({ description: '创建一个积分记录' })
  @SwaggerOk()
  async create(@Body() createIntegral: CreateIntegral) {
    return await this.integralService.createItem(createIntegral)
  }

  @Patch()
  @ApiBody({ type: UpdateIntegral })
  @ApiOperation({ description: '更新一个积分记录' })
  @SwaggerOk()
  async update(@Body() updateIntegral: UpdateIntegral) {
    return await this.integralService.updateItem(updateIntegral)
  }

  @Delete()
  @ApiQuery({ name: 'id' })
  @ApiOperation({ description: '通过id删除记录' })
  @SwaggerOk()
  async deleteItem(@Query('id') id: number) {
    return await this.integralService.deleteItem(id);
  }

  @Get()
  @NoAuth(0)
  @ApiOperation({ description: '获取/查询积分记录, public' })
  @ApiQuery({ name: 'semester', description: '学期' })
  @ApiQuery({ name: 'content', description: '学号', required: false })
  @ApiQuery({ name: 'group', description: '组别, true=>A组，false=>B组' })
  async findAll(
    @Query('semester') semester: string,
    @Query('content') content: string,
    @Query('group') group: boolean,
  ) {
    return await this.integralService.findAll(
      semester, content, group
    )
  }
}