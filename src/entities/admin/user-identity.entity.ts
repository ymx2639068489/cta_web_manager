import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../base.entity';

@Entity()
export class UserIdentity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // 部门
  @Column()
  department: string;
  // 职责
  @Column()
  duty: string;
  @OneToMany(() => User, (user) => user.identity)
  users: User[];
}
