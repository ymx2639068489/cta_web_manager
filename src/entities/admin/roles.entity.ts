import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { BaseEntity } from '../base.entity';
import { AdminUser } from './admin-user.entity';
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

  @Column({ type: 'longtext' })
  routers: string;
}
