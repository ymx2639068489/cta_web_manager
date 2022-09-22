import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
@Entity()
export class ActiveTime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  activeName: string;

  // 开始时间
  @Column({ type: 'datetime', nullable: true })
  startTime: Date;

  // 结束时间
  @Column({ type: 'datetime', nullable: true })
  endTime: Date;
}