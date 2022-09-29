import { Api } from '@/common/utils/api';
import { ActiveTime } from '@/entities/active-time';
import { activeName } from '@/enum/active-time';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ActiveTimeService {
  constructor(
    @InjectRepository(ActiveTime)
    private readonly activeTimeRepository: Repository<ActiveTime>,
  ) {}

  async isActive(active: activeName): Promise<boolean> {
    const _1 = await this.activeTimeRepository.findOne({
      where: { activeName: active }
    })
    if (!_1) return false;
    const nowDate = new Date()
    return _1.startTime <= nowDate && nowDate <= _1.endTime
  }

  async setStartTime(activeName: string, date: number) {
    const item = await this.activeTimeRepository.findOne({
      where: { activeName }
    })
    if (!item) return { code: -1, message: 'active is not found' }
    try {
      await this.activeTimeRepository.save(
        await this.activeTimeRepository.preload({
          ...item,
          startTime: new Date(date)
        })
      )
      return Api.ok()
    } catch (err) {
      return Api.err(-2, err.message)
    }
  }
  async setEndTime(activeName: string, date: number) {
    const item = await this.activeTimeRepository.findOne({
      where: { activeName }
    })
    if (!item) return Api.err(-1, 'active is not found')
    try {
      await this.activeTimeRepository.save(
        await this.activeTimeRepository.preload({
          ...item,
          endTime: new Date(date)
        })
      )
      return Api.ok()
    } catch (err) {
      return Api.err(-2, err.message)
    }
  }
  // 获取所有活动
  async getAllActiveList() {
    return Api.ok(
      (await this.activeTimeRepository.find()).map((item: ActiveTime) => ({
        ...item,
        startTime: new Date(item.startTime).getTime(),
        endTime: new Date(item.endTime).getTime()
      }))
    )
  }
}
