import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from '../admin';
import { BaseEntity } from '../base.entity';
@Entity()
export class Router extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  name: string;

  @Column()
  parent?: number;

  @JoinTable()
  @ManyToMany(() => Roles, roles => roles.routers)
  roles?: Roles[];
}