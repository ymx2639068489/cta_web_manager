import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GxaApplicationForm } from '.';
import { BaseEntity } from '../base.entity';

@Entity()
export class GxaWork extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  // 作品和报名表一对一
  @OneToOne(() => GxaApplicationForm)
  @JoinColumn()
  gxaApplicationForm: GxaApplicationForm;

  // 首页展示图片地址
  @Column({ default: 'https://ts1.cn.mm.bing.net/th?id=OIP-C.wc_dCG_KbIKZwMdtD3gL2QHaEt&w=313&h=199&c=8&rs=1&qlt=90&o=6&dpr=1.1&pid=3.1&rm=2'})
  showImg: string;

  // 网站简介
  @Column({ type: 'longtext' })
  websiteIntroduction: string;

  /**
   * 如果此作品是静态，则会分配到一个服务器某一个端口号上
   * 如果是动态，则会提供一个前台地址（id + 4w）。
   * 提交作品时，会提交对应的网址，在用户注册时或动态组自行提交
   */
  @Column()
  websiteUrl: string;

  /**
   * 如果是动态的则需要提交到github/gitee上去，然后将项目地址发给我们
   * 静态则不需要
   */
  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  isApproved: boolean;
}