import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from '../admin';
import { PickType } from '@nestjs/swagger';

@Entity('GxaApplicationForm')
export class GxaApplicationForm extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 第几届
  @Column({ type: 'int', default: new Date().getFullYear() })
  session: number;

  // 作品名称
  @Column({ nullable: true })
  workName: string;

  // 小队名字
  @Column()
  teamName: string;

  // 组别, false -> 静态, true -> 动态
  @Column({ type: 'bool', default: false })
  group: boolean;

  // 队长 / 负责人
  @ManyToOne(() => User)
  @JoinColumn()
  leader: User;

  // 队员一
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  teamMember1: User;
  
  // 队员二
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  teamMember2: User;

  // 参赛团队学生特长
  @Column({ type: 'longtext', nullable: true })
  teamMemberSpecialty: string;
  // 作品简介
  @Column({ type: 'longtext', nullable: true })
  introductionToWorks: string;
  // 分配端口号
  @Column({ type: 'int', nullable: true })
  portNumber: number;
  // 是否报名
  @Column({ type: 'bool', default: false })
  isDeliver: boolean;
}