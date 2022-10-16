import { Api } from '@/common/utils/api';
import { AlgorithmIntegral } from '@/entities/algorithmIntegral';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateIntegral, UpdateIntegral } from '@/dto/algorithm-integral';
import { User } from '@/entities/admin';
@Injectable()
export class AlgorithmIntegralService {
  constructor(
    @InjectRepository(AlgorithmIntegral)
    private readonly integralRepository: Repository<AlgorithmIntegral>,
    private readonly userService: UserService,
  ) { }

  async findAll(
    semester: string,
    content: string,
    group: boolean,
  ) {
    const year = new Date().getFullYear()
    let where: { semester: string, user?: User }[] = []
    if (content) {
      const users: User[] = []
      if (group) {
        users.push(...await this.userService.findOneByContentAndClass(
          content,
          year
        ))
      } else {
        for (const item of [year - 1, year - 2]) {
          users.push(...await this.userService.findOneByContentAndClass(
            content,
            item
          ))
        }
      }
      where = users.map((user: User) => ({ user, semester }))
    } else {
      const users: User[] = []
      if (group) {
        users.push(...await this.userService.findOneByClass(year))
      } else {
        for (const item of [year - 1, year - 2]) {
          users.push(...await this.userService.findOneByClass(item))
        }
      }
      where = users.map((user: User) => ({ user, semester }))
    }
    const [_list, total] = await this.integralRepository.findAndCount({
      where,
      relations: ['user']
    })
    const list = []
    const row = []
    _list.forEach(item => {
      if (!row.includes(item.compititionName)) row.push(item.compititionName)
      const idx = list.findIndex(_item => _item.user.studentId === item.user.studentId)
      const res = {
        id: item.id,
        integral: item.integral,
        competitionName: item.compititionName,
        semester: item.semester,
        description: item.description,
      }
      if (idx !== -1) {
        list[idx].list.push(res)
        list[idx].ans += res.integral
      } else {
        list.push({
          user: item.user,
          ans: res.integral,
          list: new Array(1).fill(res)
        })
      }
    })
    row.sort((a, b) => {
      const _1 = a.match(/[0-9]{1,2}/)
      const _2 = b.match(/[0-9]{1,2}/)
      if (!_1) return 1;
      if (!_2) return -1;
      return _1[0] - _2[0];
    })
    row.unshift('总分')
    list.sort((a, b) => {
      return b.ans - a.ans
    })
    return {
      code: 0,
      list,
      row
    }
  }

  async createItem(createIntegral: CreateIntegral) {
    const user = await this.userService.findOneByStudentId(createIntegral.studentId)
    if (!user) return Api.err(-2, 'user is not found')

    const _item = await this.integralRepository.findOne({
      where: {
        compititionName: createIntegral.compititionName,
        semester: createIntegral.semester,
        user
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
