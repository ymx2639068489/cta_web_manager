import { Api } from '@/common/utils/api';
import { Banner } from '@/entities/banner';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBannerDto, UpdateBannerDto } from '@/dto/banner';
@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>
  ) {}
  async findOne(id: number): Promise<Banner> {
    return await this.bannerRepository.findOne({ where: { id }});
  }
  async findAll() {
    return Api.ok(await this.bannerRepository.find())
  }
  async createItem(createBannerDto: CreateBannerDto) {
    try {
      await this.bannerRepository.save(
        this.bannerRepository.create(createBannerDto)
      )
      return Api.ok()
    } catch (err) {
      return { code: -1, message: err.message }
    }
  }
  async updateItem(updateBannerDto: UpdateBannerDto) {
    try {
      await this.bannerRepository.save(
        await this.bannerRepository.preload({
          ...updateBannerDto
        })
      )
    } catch (err) {
      return { code: -1, message: err.message }
    }
  }
  async deleteItem(id: number) {
    const item = await this.findOne(id)
    if (!item) return { code: -1, message: 'banner is not found' }
    try {
      await this.bannerRepository.softRemove(item)
    } catch (err) {
      return { code: -1, message: err.message }
    }
  }
}
