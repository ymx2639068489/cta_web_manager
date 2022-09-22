import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity()
export class Replacement extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: false, type: 'int' })
  session: number;

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

  @Column()
  identity: string;
}
