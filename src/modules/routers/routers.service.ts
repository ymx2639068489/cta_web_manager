import { Result } from '@/common/interface/result';
import { GetRouterDto } from '@/dto/routers';
import { AdminUser, Roles } from '@/entities/admin';
import { Router } from '@/entities/routers';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Connection, getManager, Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class RoutersService {

  constructor(
    @InjectRepository(Router)
    private readonly routerRepository: Repository<Router>,
    private readonly userService: UserService,
    private readonly connection: Connection,
  ) {}
  // 过滤掉roles属性
  private transformationToGetRouterDto(routers: any) {
    return routers.map(router => {
      if (router.children.length > 0) {
        return {
          title: router.title,
          name: router.name,
          children: this.transformationToGetRouterDto(router.children)
        }
      }
      return {
        title: router.title,
        name: router.name,
      }
    })
  }
  // 获取管理员对应的路由
  async getMenus(user: AdminUser): Promise<Result<GetRouterDto>> {
    const routers = this.transformationToGetRouterDto(
      await this.findAllByRole(user.roles)
    )
    
    return { code: 0, message: '获取成功', data: routers }
  }

  async findAllByRole(role: Roles) {
    const routers = await this.connection
      .getRepository(Router)
      .createQueryBuilder("router")
      .leftJoinAndSelect("router.roles", "roles")
      .getMany();
    
    return this.getFilterRoutes(
      routers.filter(router => router.roles.findIndex(roles => roles.id === role.id) !== -1),
      -1
    )
  }
  async findOneByName(name: string) {
    return this.routerRepository.findOne({
      where: { name },
      relations: ['roles']
    })
  }
  /**
   * 我们需要先转换为一棵树，然后再获取所有的叶子节点
   * @param routers 一个数组
   * @returns 
   */
  getRouterByRole(routers: any) {
    return this.getRouterLeafNode(this.getFilterRoutes(routers, -1))
  }
  getRouterLeafNode(routers: any) {
    const res = []
    routers.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        res.push(...this.getRouterLeafNode(item.children))
      } else {
        res.push({
          name: item.name,
          title: item.title
        })
      }
    })
    return res
  }
  // 将路由结构化
  private getFilterRoutes(routers: Router[], parent: number) {
    return routers.filter(router => router.parent === parent).map(router => ({
      title: router.title,
      name: router.name,
      roles: router.roles,
      children: this.getFilterRoutes(routers, router.id)
    }))
  }

  private async clearRouter(role: Roles, router: any) {
    await Promise.all(router.children.map(async (_cr: any) => {
      await this.clearRouter(role, _cr)
    }))
    router = await this.findOneByName(router.name)
    return await getManager().transaction(async (manager) => {
      const _r = await this.routerRepository.preload({
        ...router,
        roles: router.roles.filter((item: any) => item.id !== role.id)
      })
      await manager.save(Router, _r)
    })
  }

  /**
   * 比较用户传过来的路由和之前的路由，如果穿过来的路由没有之前存在的路由，则我们需要把他删了
   * @param role 
   * @param routers 
   * @param currtentRouters 
   */
  private async compareRouter(role: Roles, routers: any, currtentRouters: any) {
    if (!routers || !currtentRouters) return;
    // 遍历之前所有的路由
    return Promise.all(currtentRouters.map(async (router: any) => {
      // 查询这个路由是否在之前存在，不存在就删除该节点
      const _r = routers.find((item: any) => item.name === router.name)
  
      if (!_r) {
        await this.clearRouter(role, router)
      }
      // 无论该节点存在与否，都要继续去比较子节点
      if (router.children && router.children.length > 0) {
        await this.compareRouter(role, _r.children, router.children)
      }      
    }))
  }

  // 外部接口，需要进行清除路由和添加路由
  async setRoleRouter(role: Roles, routers: any) {
    // 比较之前的路由，删除掉没有传过来的路由
    await this.compareRouter(role, routers, await this.findAllByRole(role))
    // 剩下的就是新增的或之前有的
    return this.setRoleRouters(role, routers, -1)
  }

  // 只添加路由
  async setRoleRouters(role: Roles, routers: any, parent: number) {
    return Promise.all(routers.map(async (router: any) => {
      const { name, title, children } = router
      let res = await this.findOneByName(name);
      if (!res) {
        res = this.routerRepository.create({
          name, title, parent, roles: [role]
        })
      } else {
        const roles = [...res?.roles, role]
        res = await this.routerRepository.preload({
          ...res,
          roles
        })
      }
      try {
        res = await this.routerRepository.save(res);
        if (children && children.length > 0) {
          await this.setRoleRouters(role, children, res.id)
        }
        return { code: 0, message: 'success' };
      } catch (err) {
        return { code: -1, message: err };
      }
    }))
  }
}
