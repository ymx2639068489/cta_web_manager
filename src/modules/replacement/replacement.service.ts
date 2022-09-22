import { Api } from '@/common/utils/api';
import { Replacement } from '@/entities/replacement';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '@/entities/admin';
@Injectable()
export class ReplacementService {
  constructor(
    @InjectRepository(Replacement)
    private readonly replacementRepository: Repository<Replacement>,
    private readonly userService: UserService,
  ) {}
  // 点击结束换届，把当前届的所有干部入库
  async termEnd() {
    await getManager().transaction(async manager => {
      const identity = await this.userService.getUserIdentityById(20)
      await Promise.all((await this.userService.findAllOfficial()).map(async item => {
        await manager.save(
          User,
          await this.userService.updateUserIdentityToManager({
            ...item,
            identity
          })
        )
      }))
      await Promise.all((await this.userService.findAllCadres()).map(async item => {
        const _item = new Replacement()
        _item.session = new Date().getFullYear() + 1
        for (let key of ['college', 'class', 'username', 'major', 'qq', 'studentId', ]) {
          _item[key] = item[key]
        }
        _item.identity = `${item.identity.department}_${item.identity.duty}`
        // 记录往届干部
        await manager.save(
          Replacement,
          this.replacementRepository.create(_item)
        )
        // 然后更改用户的身份，改为会员
        await manager.save(
          User,
          await this.userService.updateUserIdentityToManager({
            ...item,
            identity
          })
        )
      }))
    })
    return Api.ok()
  }
  // 设置干部
  async setCadres(studentId: string, role: string) {
    // 获取到对应identity
    const identity = await this.userService.getUserIdentityByRole(role)
    // 查询到用户
    const _user = await this.userService.findOneByStudentId(studentId)
    if (!_user) return { code: -1, message: 'user is not found' }
    try {
      await getManager().transaction(async manager => {
        // 设置为指定干部
        await manager.save(User, await this.userService.updateUserIdentityToManager({
          ..._user,
          identity
        }))
      })
      return Api.ok()
    } catch (err) {
      return { code: -2, message: err.message }
    }
  }
  // 获取现任干部
  async getAllCadres() {
    return Api.ok(await this.userService.findAllCadres())
  }
  // 获取往届干部
  async getFormerCadres(session: number) {
    return Api.ok(await this.replacementRepository.find({
      where: { session }
    }))
  }
}
