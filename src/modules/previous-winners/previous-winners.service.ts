import { PreviousWinners } from '@/entities/previousWinners';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePreviousWinnerDto,
  UpdatePreviousWinnersDto
} from '@/dto/previousWinners';
import { Api } from '@/common/utils/api';
import { UserService } from '../user/user.service';
@Injectable()
export class PreviousWinnersService {
  constructor(
    @InjectRepository(PreviousWinners)
    private readonly previousWinnersRepository: Repository<PreviousWinners>,
    private readonly userService: UserService
  ) {}

  private async findOne(id: number) {
    return await this.previousWinnersRepository.findOne({ where: { id }})
  } 

  async create(createPreviousWinnerDto: CreatePreviousWinnerDto) {
    const _user = await this.userService.findOneByStudentId(createPreviousWinnerDto.studentId)
    if (!_user) return Api.err(-2, 'user is not found')
    try {
      await this.previousWinnersRepository.save(
        this.previousWinnersRepository.create({
          ...createPreviousWinnerDto,
          class: _user.class,
          major: _user.major,
          username: _user.username
        })
      )
      return Api.ok()
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }

  async update(updatePreviousWinnersDto: UpdatePreviousWinnersDto) {
    try {
      await this.previousWinnersRepository.save(
        await this.previousWinnersRepository.preload(
          updatePreviousWinnersDto
        )
      )
      return Api.ok()
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }

  async delete(id: number) {
    try {
      await this.previousWinnersRepository.softRemove(
        await this.findOne(id)
      )
      return Api.ok()
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }

  async findAll(competitionName: string, session: string) {
    try {
      const list = await this.previousWinnersRepository.find({
        where: { competitionName, session }
      })
      return Api.pagerOk({ list })
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }
}
