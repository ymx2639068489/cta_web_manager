import { Api } from '@/common/utils/api';
import { newbornAlgoirthmCompetition } from '@/entities/newbornAlgorithmCompetition';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NewbornAlgoirthmService {
  constructor(
    @InjectRepository(newbornAlgoirthmCompetition)
    private readonly newbornRepository: Repository<newbornAlgoirthmCompetition>
  ) {}
  async findOneByUser(user: any) {
    return await this.newbornRepository.findOne({
      where: { user }
    })
  }
  async findAll() {
    const list = await this.newbornRepository.find()
    return Api.ok({
      'YB': list.filter(item => item.school),
      'ZG': list.filter(item => !item.school)
    })
  }
}
