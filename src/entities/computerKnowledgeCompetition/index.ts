import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TopicType, AnsEnum } from '../../enum/TopicType';
import { User } from '../admin';

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: TopicType, type: 'enum' })
  type: TopicType;

  @Column()
  topic: string;

  @Column()
  optionA: string;

  @Column()
  optionB: string;

  @Column({ nullable: true })
  optionC: string;

  @Column({ nullable: true })
  optionD: string;
  /**
   * ans =>
   *  单选: 0001, 0010, 0100, 1000
   *  多选:
   *    2: 1100, 1010, 1001, 0110, 0101, 0011
   *    3: 1110, 1101, 0111
   *    4: 1111
   */
  @Column({ enum: AnsEnum, type: 'enum' })
  ans: AnsEnum;
}

@Entity()
export class TestPaper extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @OneToOne(() => User)
  user: User;

  @Column({ type: 'longtext' })
  questions: string;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'int' })
  totalDuration: number;
}