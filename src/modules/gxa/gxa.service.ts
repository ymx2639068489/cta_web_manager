import { Api } from '@/common/utils/api';
import { SetGxaScoreDto } from '@/dto/gxa';
import { GxaApplicationForm, GxaScore, GxaWork } from '@/entities/gxa';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { ActiveTimeService } from '../active-time/active-time.service';
import { UserService } from '../user/user.service';
@Injectable()
export class GxaService {
  constructor(
    private readonly userService: UserService,
    private readonly activeTimeService: ActiveTimeService,
    @InjectRepository(GxaScore)
    private readonly gxaScoreRepository: Repository<GxaScore>,
    @InjectRepository(GxaWork)
    private readonly gxaWordRepository: Repository<GxaWork>,
    @InjectRepository(GxaApplicationForm)
    private readonly gxaApplicationFormRepository: Repository<GxaApplicationForm>,
  ) {}

  // 获取所有的报名表信息
  // 分组
  async findWordAll(user: any) {
    const list = await this.gxaWordRepository.find({
      where: { isApproved: true },
      relations: ['gxaApplicationForm']
    })
    // 如果取消报名了，即这份作品没有对应的报名表
    // 就需要过滤一遍。然后查询到sql
    const res = await Promise.all(list.filter(item => item.gxaApplicationForm)
      .map(async (item) => {
        let value = await this.gxaScoreRepository.findOne({
          where: { work: item }
        })
        // 获取当前用户的打分表
        if (value?.score) value = JSON.parse(value.score)[user.id]
        // 添加字段
        Reflect.defineProperty(item, 'score', {
          value: value || new Array(14).fill(0),
          configurable: false,
          enumerable: true,
          writable: true
        })
        Reflect.defineProperty(item, 'workName', {
          value: item.gxaApplicationForm.workName,
          configurable: false,
          enumerable: true,
          writable: true
        })
        return item
      }))
    const staticArray = [], dynamicArray = []
    res.forEach((item) => {
      if (item.gxaApplicationForm.group) dynamicArray.push(item)
      else staticArray.push(item)
    })
    return Api.ok({
      static: staticArray,
      dynamic: dynamicArray,
    })
  }

  // 给作品打分
  async setScore(user: any, setGxaScoreDto: SetGxaScoreDto) {
    const item = await this.gxaWordRepository.findOne({
      where: { id: setGxaScoreDto.id }
    });
    if (!item) return { code: -2, message: '未查询到对应报名表' };
    const __score = await this.gxaScoreRepository.findOne({
      where: { work: item }
    });
    let score: any;
    try {
      if (__score) {
        const _s = JSON.parse(__score.score)
        _s[user.id][setGxaScoreDto.idx] = setGxaScoreDto.score
        score = await this.gxaScoreRepository.preload({
          ...__score,
          score: JSON.stringify(_s)
        })
      } else {
        const _s = {
          [user.id]: new Array(14).fill(0)
        }
        _s[user.id][setGxaScoreDto.idx] = setGxaScoreDto.score
        score = this.gxaScoreRepository.create({
          work: item,
          score: JSON.stringify(_s)
        })
      }
      await this.gxaScoreRepository.save(score);
      return Api.ok()
    } catch (err) {
      return { code: -3, message: err };
    }
  }

  // 获取所有作品总分对应的分数（评分完成）
  async getAllWorkAndScore() {
    try {
      const data = await Promise.all(
        (await this.gxaWordRepository.find({
          where: { isApproved: true },
          relations: ['gxaApplicationForm']
        })).filter((item: GxaWork) => item.gxaApplicationForm).map(async (item: GxaWork) => {
          const {
            leader,
            teamMember1,
            teamMember2,
            teamName,
            workName
          } = await this.gxaApplicationFormRepository.findOne({
            where: { id: item.gxaApplicationForm.id },
            relations: ['leader', 'teamMember1', 'teamMember2']
          })
          for (const item of ['id', 'gender', 'qq', 'phoneNumber', 'avatarUrl']) {
            if (leader) delete leader[item]
            if (teamMember1) delete teamMember1[item]
            if (teamMember2) delete teamMember2[item]
          }
          const _ = await this.gxaScoreRepository.findOne({
            select: ['score'],
            where: { work: item }
          })
          if (_) throw new Error('尚未完成全部打分')
          const score = JSON.parse(_.score)
          for(const key in score) {
            score[key] = score[key].reduce((pre: number, curt: number) => pre + curt, 0)
          }
          return {
            teamName,
            workName,
            websiteUrl: item.websiteUrl,
            websiteIntroduction: item.websiteIntroduction,
            showImg: item.showImg,
            githubUrl: item.githubUrl,
            leader,
            teamMember1,
            teamMember2,
            score
          }
        })
      )
      return { code: 0, message: '', data };
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }
  // 初审
  async firstTrialGxaWork(id: number, status: boolean) {
    const _work = await this.gxaWordRepository.findOne({
      where: { id }
    })
    if (!_work) return { code: -1, message: 'work is not found' }
    try {
      await this.gxaWordRepository.save(
        await this.gxaWordRepository.preload({
          ..._work,
          isApproved: status
        })
      )
      return Api.ok()
    } catch (err) {
      return { code: -2, message: err.message }
    }
  }
  // 获取未审核的作品或拒绝的作品
  async getUnapprovedWork() {
    const list = await this.gxaWordRepository.find({
      where: [{ isApproved: false }, { isApproved: IsNull() }],
      relations: ['gxaApplicationForm']
    })
    return Api.ok({
      static: list.filter(item => !item.gxaApplicationForm.group && item.isApproved !== false),
      dynamic: list.filter(item => item.gxaApplicationForm.group && item.isApproved !== false),
      rejected: list.filter(item => item.isApproved === false)
    })
  }
  // 获取决赛名单
  async getFinalsTeamList() {
  }

  async findRegistered(skip: number, take: number, content: string) {
    let where: any
    if (content) {
      where = {
        isDeliver: true,
        teamName: Like(`%${content}%`)
      }
    } else {
      where = {
        isDeliver: true,
      }
    }

    const [list, total] = await this.gxaApplicationFormRepository.findAndCount({
      where,
      relations: ['leader', 'teamMember1', 'teamMember2'],
      skip,
      take
    })
    return Api.pagerOk({ list, total })
  }
}
