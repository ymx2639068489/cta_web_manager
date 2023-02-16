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

  /**
   * 组别,
   * false -> 静态
   * true -> 动态
   */
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

  /**
   * 当前状态
   * 0: 新建状态、尚未报名
   * 1: 已报名
   * 2: 已提交作品
   * 3: 已初审通过
   * 4: 作品正在打分
   * 5: 打完分了
   * 6: 进入决赛 
   */
  @Column({ type: 'int', default: 0 })
  status: number;

  // 首页展示图片地址
  @Column({ nullable: true })
  indexHtmlImg: string;

  /**
   * 如果此作品是静态，则会分配到一个服务器某一个端口号上
   * 如果是动态，则会提供一个前台地址（id + 4w）。
   * 提交作品时，会提交对应的网址，在用户注册时或动态组自行提交
   */
  @Column({ nullable: true })
  websiteUrl: string;
  /**
   * 如果是动态的则需要提交到github/gitee上去，然后将项目地址发给我们
   * 静态则不需要
   */
  @Column({ nullable: true })
  githubUrl: string;

  @Column({ type: 'longtext', nullable: true })
  score: string;

  @Column({ type: 'double', default: 0, nullable: true })
  networkScore: number;
}