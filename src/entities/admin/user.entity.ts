import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserIdentity } from './user-identity.entity';

@Entity('Users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // 姓名
  @Column({
    comment: '姓名',
  })
  username: string;
  // 学号
  @Column({
    comment: '学号',
  })
  studentId: string;

  // 性别
  @Column({
    comment: '性别',
    type: 'bool',
    default: false,
    nullable: false,
  })
  gender: boolean;

  // 密码
  @Column({
    comment: '密码',
  })
  password: string;
  // 学院
  @Column({
    comment: '学院',
    nullable: true,
  })
  college?: string;
  // 专业
  @Column({
    comment: '专业',
    nullable: true,
  })
  major?: string;
  // 班级
  @Column({
    comment: '班级',
    nullable: true,
  })
  class?: string;
  // QQ
  @Column({
    comment: 'QQ',
    nullable: true,
  })
  qq?: string;
  // 手机号
  @Column({
    comment: 'phoneNumber',
    nullable: true
  })
  phoneNumber: string;
  // 手机号
  @Column({
    comment: 'avatarUrl',
    nullable: true,
  })
  avatarUrl?: string;
  
  // 身份
  @ManyToOne(() => UserIdentity, (userIdentity) => userIdentity.users)
  identity: UserIdentity;
}
