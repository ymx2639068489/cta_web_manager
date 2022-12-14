import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Question,
  TestPaper
} from '@/entities/computerKnowledgeCompetition';
import { Repository } from 'typeorm';
import { Api } from '@/common/utils/api';
import { Result } from '@/common/interface/result';
import { AllQuestionDto, CreateQuestionDto, UpdateQuestionDto } from '@/dto/computerKnowledge';
import { AnsEnum, TopicType } from '@/enum/TopicType';
@Injectable()
export class ComputerCompetitionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(TestPaper)
    private readonly testPaperRepository: Repository<TestPaper>
  ) { }

  // 获取所有问题列表
  async findAll(page: number, pageSize: number, content: string) {
    let list: Question[], total: number;
    if (content) {
      [list, total] = await this.questionRepository.findAndCount({
        where: { topic: content },
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    } else {
      [list, total] = await this.questionRepository.findAndCount({
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    }
    return Api.pagerOk({
      total,
      list,
    })
  }
  // 新建一个问题
  async createQuestionItem(
    createQuestionDto: CreateQuestionDto,
    ans: number,
    type: number
  ) {
    try {
      await this.questionRepository.save(
        this.questionRepository.create({
          ...createQuestionDto,
          ans,
          type
        })
      )
      return Api.ok()
    } catch (err) {
      return { code: -1, message: err.message }
    }
  }
  // 更新问题
  async updateQuestionItem(
    updateQuestionDto: UpdateQuestionDto,
    ans: number,
    type: number
  ) {
    try {
      await this.questionRepository.save(
        await this.questionRepository.preload({
          ...updateQuestionDto,
          ans,
          type
        })
      )
      return Api.ok()
    } catch (err) {
      return { code: -1, message: err.message }
    }
  }
  // 删除
  async deleteQuestionItem(id: number) {
    try {
      await this.questionRepository.softRemove(
        await this.questionRepository.findOne({ where: { id } })
      )
      return Api.ok()
    } catch (err) {
      return { code: -1, message: err.message }
    }
  }
}
