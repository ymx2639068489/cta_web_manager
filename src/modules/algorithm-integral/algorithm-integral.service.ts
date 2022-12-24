import { Api } from '@/common/utils/api';
import { AlgorithmIntegral } from '@/entities/algorithmIntegral';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateIntegral, UpdateIntegral } from '@/dto/algorithm-integral';
@Injectable()
export class AlgorithmIntegralService {
  constructor(
    @InjectRepository(AlgorithmIntegral)
    private readonly integralRepository: Repository<AlgorithmIntegral>,
    private readonly userService: UserService,
  ) { }

  async findAll(
    semester: string,
    group: boolean,
  ) {
    let _res = await this.integralRepository.find({
      where: { semester, group },
      relations: ['user'],
    })
    _res = _res.filter(v => v.user !== null)
    const header = new Set<string>([..._res.map((v) => v.compititionName)]);
    const data = new Map<string, any>();
    _res.forEach((v) => {
      if (!data.has(v.user.studentId)) {
        data.set(v.user.studentId, {
          user: {
            username: v.user.username,
            major: v.user.major,
          },
          ans: 0,
          list: []
        })
      }
      const item = data.get(v.user.studentId);
      item.ans += v.integral;
      item.list.push({
        id: v.id,
        description: v.description,
        competitionName: v.compititionName,
        integral: v.integral,
      })
      data.set(v.user.studentId, item);
    })
    const row = Array.from(header);
    row.unshift('总分');
    const list = []
    data.forEach(v => list.push(v));
    list.sort((a, b) => b.ans - a.ans);
    return { code: 0, row, list };
  }

  async createItem(createIntegral: CreateIntegral) {
    const user = await this.userService.findOneByStudentId(createIntegral.studentId)
    if (!user) return Api.err(-2, 'user is not found')

    const _item = await this.integralRepository.findOne({
      where: {
        compititionName: createIntegral.compititionName,
        semester: createIntegral.semester,
        user,
      }
    })
    if (_item) return Api.err(-3, '重复')
    try {
      await this.integralRepository.save(
        this.integralRepository.create({
          ...createIntegral,
          user
        })
      )
      return Api.ok()
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }

  async updateItem(updateIntegral: UpdateIntegral) {
    const item = await this.integralRepository.findOne({
      where: { id: updateIntegral.id }
    })
    if (!item) return Api.err(-2, 'integral is not found')
    try {
      await this.integralRepository.save(
        await this.integralRepository.preload({
          ...item,
          description: updateIntegral.description,
          integral: updateIntegral.integral,
          id: item.id
        })
      )
      return Api.ok()
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }

  async deleteItem(id: number) {
    try {
      const item = await this.integralRepository.findOne({
        where: { id }
      })
      await this.integralRepository.softRemove(item)
      return Api.ok()
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }
}
