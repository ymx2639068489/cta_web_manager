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
  ) {}

  // private async findOne(where: any) {}

  async findAll(
    page: number,
    pageSize: number,
    semester: string,
    studentId: string,
  ) {
    let where: { semester: string, user?: User }[] = [{ semester }]
    if (studentId) {
      const users: User[] = await this.userService.findOneByContent(studentId);
      where = users.map((user: User) => ({ user, semester }))
    }
    const [_list, total] = await this.integralRepository.findAndCount({
      where,
      relations: ['user'],
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    const list = []
    
    _list.forEach(item => {
      const idx = list.findIndex(_item => _item.user.studentId === item.user.studentId)
      const res = {
        id: item.id,
        integral: item.integral,
        competitionName: item.compititionName,
        semester: item.semester
      }
      if (idx !== -1) {
        list[idx].list.push(res)
      } else {
        list.push({
          user: item.user,
          list: new Array(1).fill(res)
        })
      }
      
    })
    return Api.pagerOk({ list, total })
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
    try {
      await this.integralRepository.save(
        await this.integralRepository.preload({
          ...item,
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
