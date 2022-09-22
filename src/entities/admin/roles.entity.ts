import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { BaseEntity } from '../base.entity';
import { AdminUser } from './admin-user.entity';
import { Router } from '../routers';
@Entity()
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleName: string;

  @Column()
  roleDescription: string;

  @OneToMany(() => AdminUser, (adminUser) => adminUser.roles, { cascade: true })
  adminUser: AdminUser[];

  @ManyToMany(() => Router, (router) => router.roles)
  routers: Router[];
}
