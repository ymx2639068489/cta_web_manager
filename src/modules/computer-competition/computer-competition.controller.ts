import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { AllQuestionDto, CreateQuestionDto, UpdateQuestionDto } from '@/dto/computerKnowledge';
import { AnsEnum, TopicType } from '@/enum/TopicType';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ComputerCompetitionService } from './computer-competition.service';
/**
 * 1. 查看所有的题
 * 2. 修改某个题目
 * 3. 删除某个题目
 * 4. 增加一个题目
 */
@ApiBearerAuth()
@ApiTags('computer_competition')
@Controller('computer_competition')
export class ComputerCompetitionController {
  constructor(
    private readonly computerService: ComputerCompetitionService,
  ) { }

  @Get()
  @ApiOperation({ description: '获取题目列表' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'content', required: false })
  @SwaggerPagerOk(AllQuestionDto)
  async findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('content') content: string
  ) {
    return await this.computerService.findAll(page, pageSize, content)
  }

  @Post()
  @ApiOperation({ description: '新建一个题目' })
  @ApiBody({ type: CreateQuestionDto })
  @SwaggerOk()
  @ApiQuery({ name: 'ans', enum: AnsEnum })
  @ApiQuery({ name: 'type', enum: TopicType })
  async createItem(
    @Body() createQuestionDto: CreateQuestionDto,
    @Query('ans') ans: string,
    @Query('type') type: string,
  ) {
    return await this.computerService.createQuestionItem(
      createQuestionDto,
      AnsEnum[ans],
      TopicType[type]
    )
  }
  @Put()
  @ApiOperation({ description: '更新题目信息' })
  @ApiBody({ type: UpdateQuestionDto })
  @SwaggerOk()
  @ApiQuery({ name: 'ans', enum: AnsEnum })
  @ApiQuery({ name: 'type', enum: TopicType })
  async updateItem(
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Query('ans') ans: string,
    @Query('type') type: string
  ) {
    return await this.computerService.updateQuestionItem(
      updateQuestionDto,
      AnsEnum[ans],
      TopicType[type]
    )
  }
  @Delete(':id')
  @ApiOperation({ description: '删除一个题目' })
  @ApiParam({ name: 'id' })
  @SwaggerOk()
  async deleteItem(@Param('id') id: number) {
    return await this.computerService.deleteQuestionItem(id)
  }
}
