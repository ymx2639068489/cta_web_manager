import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
@Entity()
export class Banner extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  href: string;

  @Column()
  url: string;
  
  @Column({ nullable: true })
  name: string

  @Column()
  rank: number;
}