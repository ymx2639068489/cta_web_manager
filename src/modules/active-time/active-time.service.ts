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

  async setStartTime(activeName: string, date: Date) {
    const item = await this.activeTimeRepository.find({
      where: { activeName }
    })
    if (!item) return { code: -1, message: 'active is not found' }
    try {
      await this.activeTimeRepository.save(
        await this.activeTimeRepository.preload({
          ...item,
          startTime: date
        })
      )
    } catch (err) {
      return { code: -2, message: err.message }
    }
  }
  async setEndTime(activeName: string, date: Date) {
    const item = await this.activeTimeRepository.find({
      where: { activeName }
    })
    if (!item) return { code: -1, message: 'active is not found' }
    try {
      await this.activeTimeRepository.save(
        await this.activeTimeRepository.preload({
          ...item,
          endTime: date
        })
      )
    } catch (err) {
      return { code: -2, message: err.message }
    }
  }
  // 获取所有活动
  async getAllActiveList() {
    return await this.activeTimeRepository.find()
  }
}
