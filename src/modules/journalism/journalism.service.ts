import { Result } from '@/common/interface/result';
import { Api } from '@/common/utils/api';
import { AllJournalismDto, CreateJournalismDto, GetJournalismDto, UpdateJournalismDto } from '@/dto/journalism';
import { journalism } from '@/entities/journalism';
import { AdminRole } from '@/enum/roles';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class JournalismService {
  constructor(
    @InjectRepository(journalism)
    private readonly journalismRepository: Repository<journalism>,
    private readonly userService: UserService,
  ) {}

  private async findOneById(id: number): Promise<journalism> {
    return await this.journalismRepository.findOne({
      where: { id },
      relations: ['author']
    })
  }
  // 判断当前新闻作者是否是当前用户
  async checkAuthor(id: number, user: any) {
    const item = await this.findOneById(id)
    return item.author.id === user.id
  }

  async findAll(
    user: any,
    page: number,
    pageSize: number,
    content: string,
  ): Promise<Result<GetJournalismDto>> {
    let where: any = {};
    // 如果是root就把所有的返回给他
    // 不对作者筛选就可以返回所有的
    if (
      user.roles.id !== AdminRole.root &&
      user.roles.id !== AdminRole.audit_journalism_admin
    ) where = { author: user }
    if (content) where = { ...where, content: Like(`%${content}%`) }
    
    const [list, total] = await this.journalismRepository.findAndCount({
      where,
      relations: ['author'],
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    return Api.pagerOk({
      total,
      list,
    })
  }
  // 创建一个新闻
  async createJournalism(
    user: any,
    createJournalismDto: CreateJournalismDto
  ): Promise<Result<string>> {
    try {
      await this.journalismRepository.save(
        this.journalismRepository.create({
          ...createJournalismDto,
          author: user
        })
      )
      return Api.ok('新建成功')
    } catch (err) {
      return { code: -1, message: err.message }
    }
  }
  // 更新一个新闻
  async updateJournalism(
    updateJournalismDto: UpdateJournalismDto
  ): Promise<Result<string>> {
    const journalismItem = await this.findOneById(updateJournalismDto.id)
    if (!journalismItem) return { code: -1, message: `not found` }
    if (journalismItem.isApprove) return { code: -3, message: '已发布，请联系上级管理员进行打回' }
    try {
      const { content , title } = updateJournalismDto
      await this.journalismRepository.save(
        await this.journalismRepository.preload({
          ...journalismItem,
          content,
          title
        })
      )
      return Api.ok('更新成功')
    } catch(err) {
      return { code: -2, message: err.message };
    }
  }
  // 删除一个新闻
  async deleteJournalism(id: number): Promise<Result<string>> {
    try {
      const item = await this.findOneById(id)
      if (item.isApprove) return { code: -3, message: '已发布，请联系上级管理员进行打回' }
      if (!item) return { code: -2, message: 'journalism is not found' }
      await this.journalismRepository.softRemove(item)
      return Api.ok('删除成功')
    } catch (err) {
      return { code: -1, message: err.message }
    }
  }
  // 审核一个新闻
  async auditJournalism(
    id: number,
    isApprove: boolean,
    reasonsForRefusal: string
  ): Promise<Result<string>> {
    const item = await this.findOneById(id)
    if (!item) return { code: -1, message: 'journalism is not found' }
    if (item.isApprove) return { code: -3, message: '已发布，请联系上级管理员进行打回' }
    try {
      await this.journalismRepository.save(
        await this.journalismRepository.preload({
          ...item,
          isApprove,
          reasonsForRefusal
        })
      )
      return Api.ok('审核成功')
    } catch (err) {
      return { code: -2, message: err.message }
    }
  }
  // 打回撤销新闻
  async repulseJournalism(id: number) {
    const item = await this.findOneById(id)
    if (!item) return { code: -1, message: 'journalism is not found' }
    if (!item.isApprove) return { code: -3, message: '当前新闻尚未通过审核' }
    try {
      await this.journalismRepository.save(
        await this.journalismRepository.preload({
          ...item,
          isApprove: false,
          reasonsForRefusal: '取消公告，打回重写'
        })
      )
      return Api.ok('下架成功')
    } catch (err) {
      return { code: -2, message: err.message }
    }
  }
}
