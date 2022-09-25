import { CompetitionAwardLevel } from '@/enum/competition';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity()
export class PreviousWinners extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'int' })
  session: number;

  @Column()
  competitionName: string;

  // 专业
  @Column({
    comment: '专业',
  })
  major: string;

  // 班级
  @Column({
    comment: '班级',
  })
  class: string;

  @Column()
  username: string;

  @Column()
  studentId: string;

  @Column({ type: 'enum', enum: CompetitionAwardLevel })
  awardLevel: CompetitionAwardLevel;

  @Column({ nullable: true })
  remarks: string;
}
