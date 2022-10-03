import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JournalismService } from './journalism.service';
import { AllJournalismDto, CreateJournalismDto, GetJournalismDto, UpdateJournalismDto } from '@/dto/journalism';
import { SwaggerOk, SwaggerPagerOk } from '@/common/decorators';
import { Result } from '@/common/interface/result';
import { Roles } from '@/common/decorators/Role/roles.decorator';
import { AdminRole } from '@/enum/roles';
@ApiBearerAuth()
@ApiTags('journalism')
@Controller('journalism')
export class JournalismController {
  constructor(
    private readonly journalismService: JournalismService
  ) { }

  @Get()
  @ApiOperation({ description: '获取自己的所有表' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'content', required: false })
  @SwaggerPagerOk(GetJournalismDto)
  async findAll(
    @Req() { user }: any,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('content') content: string
  ): Promise<Result<GetJournalismDto>> {
    if (+pageSize === 0 || +page === 0) {
      return { code: -1, message: 'page or pageSize is not zero' };
    }
    return await this.journalismService.findAll(user, +page, +pageSize, content)
  }

  @Patch('audit/:id')
  @Roles(AdminRole.audit_journalism_admin, AdminRole.root)
  @ApiOperation({ description: '审核通过/拒绝新闻' })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'reasonsForRefusal' })
  @ApiQuery({ name: 'isApprove' })
  @SwaggerOk()
  async auditItem(
    @Req() { user }: any,
    @Param('id') id: string,
    @Query('isApprove') isApprove: boolean,
    @Query('reasonsForRefusal') reasonsForRefusal: string,
  ): Promise<Result<string>> {
    if (!await this.journalismService.checkAuthor(+id, user)) {
      return { code: -3, message: 'You are not the owner of this journalism!' }
    }
    return this.journalismService.auditJournalism(+id, isApprove, reasonsForRefusal)
  }

  @Post()
  @ApiOperation({ description: '新建一个新闻' })
  @ApiBody({ type: CreateJournalismDto })
  @SwaggerOk()
  async createItem(
    @Req() { user }: any,
    @Body() createJournalismDto: CreateJournalismDto
  ): Promise<Result<string>> {
    return this.journalismService.createJournalism(user, createJournalismDto)
  }

  @Put()
  @ApiOperation({ description: '修改一个新闻内容' })
  @ApiBody({ type: UpdateJournalismDto })
  @SwaggerOk()
  async updateItem(
    @Req() { user }: any,
    @Body() updateJournalismDto: UpdateJournalismDto
  ): Promise<Result<string>> {
    if (!await this.journalismService.checkAuthor(
      updateJournalismDto.id,
      user
    )) {
      return { code: -3, message: 'You are not the owner of this journalism!' }
    }
    return await this.journalismService.updateJournalism(updateJournalismDto)
  }

  @Roles(AdminRole.root)
  @Patch('repulseJournalism')
  @ApiOperation({ description: '对已审核的作品进行打回，取消公示' })
  @ApiQuery({ name: 'id' })
  @SwaggerOk()
  async repulseJournalism(@Query('id') id: number) {
    console.log(id);

    return await this.journalismService.repulseJournalism(id)
  }
}
