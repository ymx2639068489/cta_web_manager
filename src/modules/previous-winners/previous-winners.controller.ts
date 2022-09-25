import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { PreviousWinnersService } from './previous-winners.service';
import {
  AllPreviousWinnersDto,
  CreatePreviousWinnerDto,
  UpdatePreviousWinnersDto
} from '@/dto/previousWinners';
import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { NoAuth } from '@/common/decorators/Role/customize';
@ApiBearerAuth()
@ApiTags('previous-winners')
@Controller('previous-winners')
export class PreviousWinnersController {
  constructor(
    private readonly previousService: PreviousWinnersService
  ) {}

  @Post()
  @ApiOperation({ description: '新建一个获奖信息' })
  @ApiBody({ type: CreatePreviousWinnerDto })
  @SwaggerOk()
  async create(
    @Body() createPreviousWinnerDto: CreatePreviousWinnerDto
  ) {
    return await this.previousService.create(createPreviousWinnerDto)
  }
  @Put()
  @ApiOperation({ description: '更新一个获奖信息' })
  @ApiBody({ type: UpdatePreviousWinnersDto })
  @SwaggerOk()
  async update(
    @Body() updatePreviousWinnersDto: UpdatePreviousWinnersDto
  ) {
    return await this.previousService.update(updatePreviousWinnersDto)
  }
  @Delete(':id')
  @ApiOperation({ description: '删除一个获奖信息' })
  @ApiParam({ name: 'id' })
  @SwaggerOk()
  async delete(@Param('id') id: number) {
    return await this.previousService.delete(id)
  }

  @NoAuth(0)
  @Get('getPreviousWinnersList')
  @ApiOperation({ description: '获取获奖者列表 public' })
  @ApiQuery({ name: 'competitionName', description: '比赛名称' })
  @ApiQuery({ name: 'session', description: '第几届' })
  @SwaggerPagerOk(AllPreviousWinnersDto)
  async findAll(
    @Query('competitionName') competitionName: string,
    @Query('session') session: string,
  ) {
    return await this.previousService.findAll(competitionName, session)
  }
  
}
