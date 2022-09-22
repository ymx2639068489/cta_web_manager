import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { BaseEntity } from '../base.entity';
import { Roles } from './roles.entity';

@Entity('admin-user')
export class AdminUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ default: '默认用户名' })
  nickName: string;

  @Column()
  username: string;

  @Column({ type: 'longtext' })
  password: string;

  @Column({ default: 'https://tupian.qqw21.com/article/UploadPic/2018-7/20187192294216790.jpg' })
  avatarUrl: string;

  @Column({ nullable: true })
  email: string;
  
  @Column()
  phone: string;

  @JoinColumn()
  @ManyToOne(() => Roles)
  roles: Roles;
}