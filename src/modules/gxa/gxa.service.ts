import { Api } from '@/common/utils/api';
import { SetGxaNetworkScoreDto, SetGxaScoreDto } from '@/dto/gxa';
import { GxaApplicationForm } from '@/entities/gxa';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ActiveTimeService } from '../active-time/active-time.service';
import { UserService } from '../user/user.service';
import { GXA_STATUS } from '../../enum/gxa';
@Injectable()
export class GxaService {
  constructor(
    private readonly userService: UserService,
    private readonly activeTimeService: ActiveTimeService,
    @InjectRepository(GxaApplicationForm)
    private readonly gxaApplicationFormRepository: Repository<GxaApplicationForm>,
  ) {}

  private getNowSession(): number {
    let now = new Date();
    if (now.getMonth() >= 9) return now.getFullYear();
    return now.getFullYear() - 1;
  }

  private getScoreAvg(score: string): number {
    let t: any = JSON.parse(score);
    let a_score: number = 0, cnt: number = 0;
    for (const k in t) {
      a_score += t[k].reduce((pre: number, curt: number) => pre + curt, 0);
      cnt ++;
    }
    return a_score / cnt;
  }

  // 获取所有初审通过了的作品列表，以供打分
  async findWordAll(admin: any) {
    let session: number = this.getNowSession();
    let list = await this.gxaApplicationFormRepository.find({
      where: [
        {
          session,
          // 通过初审的
          status: GXA_STATUS.APPROVE,
        }, {
          session,
          // 正在打分的
          status: GXA_STATUS.SCORE,
        }
      ],
    })
    const staticArray = [], dynamicArray = []
    list.map((item) => {
      let res: any = {
        id: item.id,
        indexHtmlImg: item.indexHtmlImg,
        introductionToWorks: item.introductionToWorks,
        websiteUrl: item.websiteUrl,
        githubUrl: item.githubUrl,
        group: item.group,
        workName: item.workName,
        networkScore: item.networkScore,
      };
      if (item.score && JSON.parse(item.score)[admin.id])
        res.score = JSON.parse(item.score)[admin.id];
      else res.score = new Array(14).fill(0);
      return res;
    }).forEach((item: any) => {
      if (item.group) dynamicArray.push(item)
      else staticArray.push(item)
    })
    // 通过比较0分的个数，来进行排序，0分越多，说明越应该被打分
    staticArray.sort((a, b) => {
      let _1 = a.score.filter((f: number) => f !== 0).length;
      let _2 = b.score.filter((f: number) => f !== 0).length
      return _1 - _2;
    })

    dynamicArray.sort((a, b) => {
      let _1 = a.score.filter((f: number) => f !== 0).length;
      let _2 = b.score.filter((f: number) => f !== 0).length;
      return _1 - _2;
    })

    return Api.ok({
      static: staticArray,
      dynamic: dynamicArray,
    })
  }

  // 给作品打分
  async setScore(user: any, setGxaScoreDto: SetGxaScoreDto) {
    const gxaItem: GxaApplicationForm = await this.gxaApplicationFormRepository.findOne({
      where: { id: setGxaScoreDto.id },
    });
    if (!gxaItem) return Api.err(-2, '未查询到对应报名表');
    let score: any;
    if (gxaItem.score) score = JSON.parse(gxaItem.score);
    else score = {};
    if (!Array.isArray(score[user.id])) score[user.id] = new Array(14).fill(0);
    score[user.id][setGxaScoreDto.idx] = setGxaScoreDto.score;
    try {
      await this.gxaApplicationFormRepository.save(
        await this.gxaApplicationFormRepository.preload({
          ...gxaItem,
          score: JSON.stringify(score),
          status: GXA_STATUS.SCORE,
        })
      );
      return Api.ok();
    } catch (err) {
      return Api.err(-3, err.message)
    }
  }

  // 获取所有作品以及分数
  async getAllWorkAndScore() {
    const list: GxaApplicationForm[] = await this.gxaApplicationFormRepository.find({
      where: [
        {
          status: GXA_STATUS.SCORED,
          session: this.getNowSession(),
        }, {
          status: GXA_STATUS.SCORE,
          session: this.getNowSession(),
        }
      ],
      relations: ['leader', 'teamMember1', 'teamMember2'],
    });
    const staticList = [], dynamicList = [];
    const teacherSet = new Set<string>();
    list.map((item: GxaApplicationForm) => {
      const res: any = {
        teamName: item.teamName,
        workName: item.workName,
        introductionToWorks: item.introductionToWorks,
        indexHtmlImg: item.indexHtmlImg,
        githubUrl: item.githubUrl,
        websiteUrl: item.websiteUrl,
        group: item.group,
        networkScore: item.networkScore,
      };
      for (const team of ['leader', 'teamMember1', 'teamMember2']) {
        if (item[team]) {
          res[team] = {};
          for (const key of ['username', 'studentId', 'college', 'major', 'class']) {
            res[team][key] = item[team][key];
          }
        }
      }
      let score = JSON.parse(item.score);
      for (const key in score) {
        teacherSet.add(key);
      }
      res.score = score;
      res.avg = this.getScoreAvg(item.score);
      return res;
    }).forEach(item => {
      const teachers: string[] = [...teacherSet];
      let idx = 1;
      for (const teacher of teachers) {
        if (item.score[teacher]) {
          item[`teacher${idx ++ }`] =
            item.score[teacher].reduce((pre: number, curt: number) => pre + curt, 0);
        }
        else item[`teacher${idx ++ }`] = 0;
      }
      const { score, ...rest } = item;
      if (item.group) dynamicList.push(rest);
      else staticList.push(rest);
    });
    dynamicList.sort((a, b) => {
      return b.avg - a.avg;
    });
    staticList.sort((a, b) => {
      return b.avg - a.avg;
    });
    return Api.ok({ staticList, dynamicList, teachers: [...teacherSet] });
  }
  // 初审
  async firstTrialGxaWork(id: number, status: boolean) {
    const gxaItem: GxaApplicationForm = await this.gxaApplicationFormRepository.findOne({
      where: { id },
    });
    
    if (!gxaItem) return Api.err(-2, '没有找到对应的报名表');
    let res: number;
    // 如果已经提交作品了，初审成功，则把状态改成下一步
    if (gxaItem.status === GXA_STATUS.WORK) {
      if (status) res = gxaItem.status + 1;
      else return Api.err(-4, '已经被打回/拒绝了，请勿重复操作');
    }
    // 如果已经初审通过了，但是被打回了，则需要吧状态改成上一步
    if (gxaItem.status === GXA_STATUS.APPROVE) {
      if (!status) res = gxaItem.status - 1;
      else return Api.err(-4, '已经被初审过了，请勿重复操作');
    }
    try {
      await this.gxaApplicationFormRepository.save(
        await this.gxaApplicationFormRepository.preload({
          ...gxaItem,
          status: res,
        })
      )
      return Api.ok();
    } catch(err) {
      return Api.err(-3, err.message);
    }
  }

  // 获取需要审核的作品
  async getUnapprovedWork() {
    const list: GxaApplicationForm[] = await this.gxaApplicationFormRepository.find({
      where: [
        { status: GXA_STATUS.WORK, session: this.getNowSession() },
        { status: GXA_STATUS.APPROVE, session: this.getNowSession() }
      ],
    })
    const staticList = [], dynamicList = [];
    list.forEach((item: GxaApplicationForm) => {
      const itemResult = {
        githubUrl: item.githubUrl,
        teamName: item.teamName,
        workName: item.workName,
        indexHmtlImg: item.indexHtmlImg,
        websiteUrl: item.websiteUrl,
        introductionToWorks: item.introductionToWorks,
        status: item.status,
        id: item.id,
      }
      if (!item.group) staticList.push(itemResult);
      else dynamicList.push(itemResult)
    })
    dynamicList.sort((a, b) => a.status - b.status);
    staticList.sort((a, b) => a.status - b.status);

    return Api.ok({ staticList, dynamicList });
  }
  
  // 获取当届所有已经报名了的队伍
  async findRegistered(skip: number, take: number, content: string) {
    let where: any
    let session: number = this.getNowSession();
    if (content) {
      where = [
        {
          session,
          status: GXA_STATUS.REGISTERED,
          teamName: Like(`%${content}%`),
        }, {
          session,
          status: GXA_STATUS.REGISTERED,
          workName: Like(`%${content}%`),
        }
      ]
    } else {
      where = {
        session,
        status: GXA_STATUS.REGISTERED,
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

  // 给动态组设置网络安全得分
  async setnetworkScore(setGxaNetworkScoreDto: SetGxaNetworkScoreDto) {
    const { id, score } = setGxaNetworkScoreDto;
    const item = await this.gxaApplicationFormRepository.findOne({
      where: { id, session: this.getNowSession(), group: true }
    });
    if (!item) return Api.err(-1, 'not found work');
    try {
      await this.gxaApplicationFormRepository.save(
        await this.gxaApplicationFormRepository.preload({
          ...item,
          networkScore: score,
          status: GXA_STATUS.SCORE,
        })
      )
      return Api.ok();
    } catch (err) {
      return Api.err(-2, err.message);
    }
  }

  // 一键设置决赛名单
  async setFinallyList() {
    const session: number = this.getNowSession();
    const _ = await this.gxaApplicationFormRepository.find({
      where: { session, status: GXA_STATUS.FINALLY }
    });
    if (_.length !== 0) return Api.err(-2, '请勿重复操作');
    let dl: GxaApplicationForm[] = await this.gxaApplicationFormRepository.find({
      where: { session, status: GXA_STATUS.SCORE, group: true },
    });
    let sl: GxaApplicationForm[] = await this.gxaApplicationFormRepository.find({
      where: { session, status: GXA_STATUS.SCORE, group: false },
    });
    dl.sort((a: GxaApplicationForm, b: GxaApplicationForm) => {
      let a_score = this.getScoreAvg(a.score) + a.networkScore;
      let b_score = this.getScoreAvg(b.score) + b.networkScore;
      return b_score - a_score;
    })
    sl.sort((a: GxaApplicationForm, b: GxaApplicationForm) => {
      let a_score = this.getScoreAvg(a.score);
      let b_score = this.getScoreAvg(b.score);
      return b_score - a_score;
    })
    try {
      dl = await Promise.all(dl.map(async (item: GxaApplicationForm, idx: number) => {
        if (idx < 10) {
          return await this.gxaApplicationFormRepository.preload({
            ...item,
            status: GXA_STATUS.FINALLY,
          });
        }
        return await this.gxaApplicationFormRepository.preload({
          ...item,
          status: GXA_STATUS.SCORED,
        });
      }))
      sl = await Promise.all(sl.map(async (item: GxaApplicationForm, idx: number) => {
        if (idx < 15) {
          return await this.gxaApplicationFormRepository.preload({
            ...item,
            status: GXA_STATUS.FINALLY,
          });
        }
        return await this.gxaApplicationFormRepository.preload({
          ...item,
          status: GXA_STATUS.SCORED,
        });
      }))
      await this.gxaApplicationFormRepository.save(dl);
      await this.gxaApplicationFormRepository.save(sl);
      return Api.ok({ sl, dl });
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }
  
  // 一键撤回决赛名单
  async withdrawFinallyList() {
    try {
      try {
        await this.gxaApplicationFormRepository.query(
          `update GxaApplicationForm set status = ${GXA_STATUS.SCORE} where (status = ${GXA_STATUS.FINALLY} or status = ${GXA_STATUS.SCORED}) and session = ${this.getNowSession()};`
        );
        return Api.ok();
      } catch (err) {
        return Api.err(-1, err.message)
      }
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }
}
