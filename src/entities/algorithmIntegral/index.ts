import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../admin';
import { BaseEntity } from '../base.entity';
@Entity()
export class AlgorithmIntegral extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => User)
  user: User;

  @Column()
  semester: string;

  @Column()
  compititionName: string;

  @Column({ type: 'double' })
  integral: number;

  @Column()
  description: string;

  @Column({ type: 'bool' })
  group: boolean;
}