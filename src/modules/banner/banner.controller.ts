import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { AllBannerDto, CreateBannerDto, UpdateBannerDto } from '@/dto/banner';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BannerService } from './banner.service';

@ApiTags('banner')
@ApiBearerAuth()
@Controller('banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
  ) {}

  @Get()
  @ApiOperation({ description: '获取所有轮播图, rank为-1表示不显示，否则按照升序排序' })
  @SwaggerPagerOk(AllBannerDto)
  async findAll() {
    return await this.bannerService.findAll()
  }

  @Post()
  @ApiOperation({ description: '新建一个轮播图' })
  @ApiBody({ type: CreateBannerDto })
  @SwaggerOk()
  async createItem(@Body() createBannerDto: CreateBannerDto) {
    return await this.bannerService.createItem(createBannerDto)
  }
  @Put()
  @ApiOperation({ description: '更新轮播图信息' })
  @ApiBody({ type: UpdateBannerDto })
  @SwaggerOk()
  async updateItem(@Body() updateBannerDto: UpdateBannerDto) {
    return await this.bannerService.updateItem(updateBannerDto)
  }
  @Delete(':id')
  @ApiOperation({ description: '删除一个轮播图' })
  @ApiParam({ name: 'id' })
  @SwaggerOk()
  async deleteItem(@Param('id') id: number) {
    return await this.bannerService.deleteItem(id);
  }
}
