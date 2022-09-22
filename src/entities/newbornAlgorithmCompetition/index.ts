import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from '../admin';
import { CompetitionAwardLevel } from '@/enum/competition';

@Entity()
export class newbornAlgoirthmCompetition extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @Column({ enum: CompetitionAwardLevel, nullable: true, type: 'enum' })
  awardLevel: CompetitionAwardLevel;
  @Column({ type: 'boolean' })
  school: boolean;
}
