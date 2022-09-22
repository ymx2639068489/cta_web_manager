import { Result } from '@/common/interface/result';
import { Api } from '@/common/utils/api';
import { GetRecruitmentDto } from '@/dto/recruitment';
import { User } from '@/entities/admin';
import { Recruitment } from '@/entities/recruitment';
import { RecruitmentStatus } from '@/enum/recruitment';
import { AdminRole, DepartmentEnum, userRole } from '@/enum/roles';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
@Injectable()
export class RecruitmentService {
  constructor(
    @InjectRepository(Recruitment)
    private readonly recuitmentRepository: Repository<Recruitment>,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async findOneByContent(
    content: string,
    page: number,
    pageSize: number
  ) {
    const _u = await this.userService.findOneByContent(content)
    const where = [
      ..._u.map((item) => ({ user: item})),
      {
        curriculumVitae: content
      },
      {
        reasonsForElection: content
      }
    ]
    const recruitmentList = await this.recuitmentRepository.findAndCount({
      where,
      skip: (page - 1) * (pageSize),
      take: pageSize
    })
    return Api.pagerOk({
      list: recruitmentList[0],
      total: Math.ceil(recruitmentList[1] / pageSize),
      page,
      limit: pageSize,
    })
  }
  // 检查当前的身份是否匹配部门
  checkIndentity(user: any, department: DepartmentEnum): boolean {
    if (!user.type) return user.roles.id === AdminRole.root
    // 如果是理事会， 则直接return true
    if (user.identity.department === '理事会') return true
    if (!department) return false
    // 如果不是理事会，则判断部门是否匹配
    if (user.identity.department === department) return user.identity.duty !== '干事'
    return false
  }
  async findOne(id: number) {
    return await this.recuitmentRepository.findOne({
      where: { id },
      relations: ['user']
    })
  }
  // 检查当前用户是否可以操作这份申请表
  async checkAuth(user: any, id: number): Promise<boolean> {
    const item = await this.findOne(id);
    if (!item) return false;

    if (!user.type) {
      if (!([
        AdminRole.root,
        AdminRole.president,
        AdminRole.official,
        AdminRole.audit_recruitment_admin
      ].includes(user.roles.id))) {
        return false
      }
    } else {
      // 如果当前用户的部门与这份申请表的志愿对应不上
      if (!([item.firstChoice, item.secondChoice].includes(user.identity.department))) {
        return false
      }
    }
    return true
  }
  // 通过部门获取所有申请表
  async getAllByDepartment(
    department: DepartmentEnum,
    page: number,
    limit: number,
    status: RecruitmentStatus
  ): Promise<Result<GetRecruitmentDto>> {
    const offset = (+page - 1) * (+limit)
    
    const list = await this.recuitmentRepository.findAndCount({
      where: [
        { firstChoice: department, status, isDeliver: true },
        { secondChoice: department, status, isDeliver: true }
      ],
      skip: offset,
      take: limit,
      relations: ['user']
    })
    return Api.pagerOk({
      limit,
      page,
      list: list[0],
      total: Math.ceil(list[1] / limit)
    })
  }
  // 获取所有申请表
  async getAll(
    page: number,
    limit: number,
    status: number
  ): Promise<Result<GetRecruitmentDto>> {
    const offset = (+page - 1) * (+limit)
    const list = await this.recuitmentRepository.findAndCount({
      where: { status, isDeliver: true },
      skip: offset,
      take: limit,
      relations: ['user']
    })
    return Api.pagerOk({
      limit,
      page,
      list: list[0],
      total: Math.ceil(list[1] / limit)
    })
  }
  // 初审干事申请表
  async firstTrialRecruitment(user: any, id: number, status: boolean) {
    const item = await this.recuitmentRepository.findOne({
      where: {
        id,
        isDeliver: true,
        status: RecruitmentStatus.delivered
      },
      relations: ['user']
    })
    if (!item) return { code: -1, message: '未查询到此面试表' };
    if (status) {
      if (item.status === RecruitmentStatus.firstTrialed) {
        return { code: -4, message: '已审核过了' }
      }
    } else {
      if (item.status === RecruitmentStatus.firstTrialError) {
        return { code: -4, message: '重复审核过了' }
      }
    }
    try {
      if (status) {
        await this.recuitmentRepository.save(
          await this.recuitmentRepository.preload({
            ...item,
            status: RecruitmentStatus.firstTrialed
          })
        )
        if (item.user.qq && item.user.username) {
          await this.emailService.sendInterviewNoticeEmail({
            qq: item.user.qq,
            username: item.user.username
          })
        }
      } else {
        await this.recuitmentRepository.save(
          await this.recuitmentRepository.preload({
            ...item,
            status: RecruitmentStatus.firstTrialError
          })
        )
      }
      return Api.ok()
    } catch (err) {
      return { code: -3, message: err };
    }
  }
  
  // 设置干事, 在线上面试完后, 部长初审
  async setOfficial(id: number, department: DepartmentEnum) {
    const item = await this.findOne(id);
    if (!item) return { code: -2, message: 'recruitment is not found' }
    if (item.status === RecruitmentStatus.Accepted) {
      return { code: -4, message: '重复录取' }
    }
    if ((await this.userService.findOneUser(item.user.id)).identity.id !== 20) {
      return { code: -5, message: '该同学已被其他部门录取' }
    }
    if (!item.isDeliver) {
      return { code: -6, message: '对方没有提交申请表' }
    }
    try {
      await getManager().transaction(async manager => {
        // 更改状态
        await manager.save(
          Recruitment,
          await this.recuitmentRepository.preload({
            ...item,
            status: RecruitmentStatus.Accepted,
            finallyDepartment: department
          })
        )
      })
      return { code: 0, message: '录取成功' }
    } catch (err) {
      return { code: -3, message: err };
    }
  }
  // 设置干事finally
  async setOfficialFinally(id: number) {
    const item = await this.findOne(id);
    if (!item) return { code: -2, message: 'recruitment is not found' }
    if (item.status === RecruitmentStatus.FinallyAccepted) return { code: -1, message: '已被录取' };
    if (item.status !== RecruitmentStatus.Accepted) return { code: -1, message: '没有被录取' };
    
    try {
      await getManager().transaction(async manager => {
        // 更改状态
        await manager.save(
          Recruitment,
          await this.recuitmentRepository.preload({
            ...item,
            status: RecruitmentStatus.FinallyAccepted
          })
        )
        const identity = await this.userService.getIdentityByDepartmentEnum(item.finallyDepartment)
        // 更改用户身份
        await manager.save(
          User,
          await this.userService.updateUserIdentityToManager({
            ...item.user,
            identity
          })
        )
      })
    } catch (err) {
      return { code: -3, message: err.message };
    } finally {
      if (item.user.qq && item.user.username) {
        await this.emailService.sendAdmissionEmail({
          qq: item.user.qq,
          username: item.user.username,
          department: item.finallyDepartment
        })
      }
    }
  }
}
