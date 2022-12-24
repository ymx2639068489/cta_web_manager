import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser, Roles, User, UserIdentity } from '@/entities/admin';
import { Like, Not, Repository } from 'typeorm';
import { AllAdminUserDto, CreateAdminDto, SetAdminPasswordDto, UpdateAdminSelfInfoDto } from '@/dto/admin-user';
import { AdminRole, cadresRole, DepartmentEnum, userAdminRole, userRole } from '@/enum/roles';
import { Api } from '@/common/utils/api';
import { Result } from '@/common/interface/result';
import { MD5 } from 'crypto-js';
import { SetUserInfo } from '@/dto/users';
import { decrypt } from '@/common/utils/encryption';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserIdentity)
    private readonly userIdentityRepository: Repository<UserIdentity>,
  ) { }

  async setUserPassword(setUserInfo: SetUserInfo) {
    const user = await this.findOneUser(setUserInfo.id)
    if (!user) return Api.err(-1, 'user is not found')
    try {
      await this.userRepository.save({
        ...user,
        username: setUserInfo.username,
        password: MD5(setUserInfo.password).toString()
      })
      return Api.ok()
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }

  // 查询干事+干部
  async getOfficial() {
    const list = await this.userRepository.find({
      where: { identity: Not(20) },
      relations: ['identity']
    })
    const data = {
      '理事会': { '会长': [], '技术副会长': [], '常务副会长': [], },
      '秘书处': { '秘书长': [], '副秘书': [], '干事': [], },
      '组宣部': { '部长': [], '副部长': [], '干事': [], },
      '技术部': { '部长': [], '副部长': [], '干事': [], },
      '项目部': { '部长': [], '副部长': [], '干事': [], },
      '算法部': { '部长': [], '副部长': [], '干事': [], },
    }
    list.forEach(item => {
      const { department, duty } = item.identity
      delete item.identity
      switch (department) {
        case '技术服务部': {
          data['技术部'][duty].push(item)
          break
        }
        case '项目实践部': {
          data['项目部'][duty].push(item)
          break
        }
        case '算法竞赛部': {
          data['算法部'][duty].push(item)
          break
        }
        case '组织宣传部': {
          data['组宣部'][duty].push(item)
          break
        }
        default: {
          data[department][duty].push(item)
        }
      }
    })
    return Api.ok(data)
  }
  // 查询用户
  async findAllUser(page: number, pageSize: number, content: string) {
    let list: User[], total: number
    if (content) {
      [list, total] = await this.userRepository.findAndCount({
        where: [
          { username: Like(`%${content}%`) },
          { studentId: Like(`%${content}%`) }
        ],
        relations: ['identity'],
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    } else {
      [list, total] = await this.userRepository.findAndCount({
        relations: ['identity'],
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    }
    return Api.pagerOk({
      total,
      list
    })
  }

  // 删除用户
  async deleteUserItem(id: number) {
    const item = await this.userRepository.findOne({
      where: { id }
    })
    if (!item) return Api.err(-1, 'user is not founf')
    try {
      await this.userRepository.softRemove(item)
    } catch (err) {
      return Api.err(-1, err.message)
    }
  }
  async getUserIdentityByRole(role: string) {
    return await this.userIdentityRepository.findOne({
      where: { id: cadresRole[role] }
    })
  }
  // 通过id 查询管理员，用于jwt
  async findOneAdmin(id: number): Promise<AdminUser> {
    return await this.adminUserRepository.findOne({
      where: { id },
      relations: ['roles']
    })
  }
  // 通过用户名查询管理员，用于登录，查询
  async findOneByUsername(username: string) {
    return await this.adminUserRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }
  // 模糊查询user => studentId, username
  async findOneByContent(content: string) {
    return await this.userRepository.find({
      where: [
        {
          studentId: Like(`%${content}%`)
        },
        {
          username: Like(`%${content}%`)
        }
      ]
    })
  }
  // 模糊查询，确定年级
  async findOneByContentAndClass(content: string, grade: number) {
    return await this.userRepository.find({
      where: [
        {
          studentId: Like(`%${content}%`),
          class: Like(`${grade}_`)
        },
        {
          username: Like(`%${content}%`),
          class: Like(`${grade}_`)
        }
      ]
    })
  }
  // 模糊查询，确定年级
  async findOneByClass(grade: number) {
    return await this.userRepository.find({
      where: {
        class: Like(`${grade}_`)
      }
    })
  }
  // 获取当届所有干部
  async findAllCadres() {
    return await this.userRepository.find({
      select: [
        'id',
        'username',
        'studentId',
        'gender',
        'college',
        'major',
        'class',
        'avatarUrl',
        'identity',
        'qq'
      ],
      where: userAdminRole.map((item: number) => ({ identity: item })),
      relations: ['identity']
    })
  }
  // 获取当前所有干事
  async findAllOfficial() {
    return await this.userRepository.find({
      where: [
        userRole.JSB_GS,
        userRole.MSC_GS,
        userRole.ZXB_GS,
        userRole.XMB_GS,
        userRole.SFB_GS
      ].map(item => ({ identity: item })),
      relations: ['identity']
    })
  }
  // 通过id查询用户
  async findOneUser(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['identity']
    })
  }
  // 通过学号获取用户的信息
  async findOneByUsernameUser(studentId: string) {
    return this.userRepository.findOne({
      where: { studentId },
      relations: ['identity']
    })
  }
  async findOneByStudentId(studentId: string) {
    return this.userRepository.findOne({
      where: { studentId },
      relations: ['identity']
    })
  }
  // 更新用户身份以供事务使用
  async updateUserIdentityToManager(user: User) {
    return await this.userRepository.preload(user)
  }
  // 获取所有角色
  async getRoles() {
    return await this.rolesRepository.find()
  }
  async getRolesById(id: number) {
    return await this.rolesRepository.findOne({
      where: { id }
    })
  }
  // 获取角色的信息， 包括路由
  async getRoleByName(roleName: string) {
    return this.rolesRepository.findOne({
      where: { roleName },
      relations: ['routers']
    })
  }
  // 创建一个管理员
  async createAdmin(createAdminDto: CreateAdminDto) {
    const roles = await this.getRoleByName(AdminRole[createAdminDto.roles])
    if (!roles) throw new Error('roles is not found')
    const admin = this.adminUserRepository.create({
      ...createAdminDto,
      roles
    })
    return await this.adminUserRepository.save(admin)
  }
  // 获取所有管理员
  async getAllAdmin(
    page: number,
    pageSize: number,
    _roles: AdminRole[] | AdminRole,
    username: string,
  ): Promise<Result<AllAdminUserDto>> {

    const where = []
    // 将传过来的number[] | number转换为对应的条件
    if (Array.isArray(_roles)) where.push(..._roles.map(_r => {
      if (username) return { roles: _r, username: Like(`%${username}%`) }
      else return { roles: _r }
    }))
    else
      if (username) where.push({ roles: _roles, username: Like(`%${username}%`) })
      else where.push({ roles: _roles })

    const [list, total] = await this.adminUserRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['roles']
    })

    return Api.pagerOk({
      list,
      total
    })
  }
  // 通过内容查询用户
  // findAllByContent
  // 修改对应管理员的密码
  async setAdminPassword(setAdminPasswordDto: SetAdminPasswordDto): Promise<Result<string>> {
    const admin = await this.adminUserRepository.findOne({
      where: { id: setAdminPasswordDto.id }
    })
    console.log(admin);

    if (!admin) return Api.err(-1)

    try {
      await this.adminUserRepository.save(
        await this.adminUserRepository.preload({
          ...admin,
          password: MD5(setAdminPasswordDto.password).toString()
        })
      )
      return { message: '修改成功', code: 0 }
    } catch (err) {
      return { message: err, code: -1 }
    }
  }

  // 删除管理员
  async deleteAdmin(id: string) {
    const admin = await this.adminUserRepository.findOne({
      where: { id }
    })
    if (!admin) return Api.err(-1)

    try {
      await this.adminUserRepository.softRemove(admin)
      return { message: '删除成功', code: 0 }
    } catch (err) {
      return { message: err, code: -1 }
    }
  }

  // 管理员自己修改他的信息
  async updateAdminSelfInfo(
    admin: any,
    updateAdminSelfInfo: UpdateAdminSelfInfoDto
  ): Promise<Result<string>> {
    try {
      if (updateAdminSelfInfo.password) updateAdminSelfInfo.password = MD5(updateAdminSelfInfo.password).toString()
      await this.adminUserRepository.save(
        await this.adminUserRepository.preload({
          ...admin,
          ...updateAdminSelfInfo
        })
      )
    } catch (err) {
      return { code: -1, message: err };
    }
  }

  // 查询用户身份
  async getUserIdentityById(id: userRole) {
    return await this.userIdentityRepository.findOne({
      where: {
        id
      }
    })
  }
  // 通过部门，获取干事身份
  async getIdentityByDepartmentEnum(department: DepartmentEnum) {
    switch (department) {
      case DepartmentEnum.ALGORITHM_CONTEST: {
        return await this.getUserIdentityById(7)
      }
      case DepartmentEnum.ORGANIZATION_PUBLICITY: {
        return await this.getUserIdentityById(12)
      }
      case DepartmentEnum.PROJECT_PRACTICE: {
        return await this.getUserIdentityById(6)
      }
      case DepartmentEnum.SECRETARIAT: {
        return await this.getUserIdentityById(13)
      }
      case DepartmentEnum.TRCHNICAL_SERVICE: {
        return await this.getUserIdentityById(1)
      }
      default: {
        throw new TypeError('department is not enum')
      }
    }
  }
}
