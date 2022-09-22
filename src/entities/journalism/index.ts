import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { AdminUser } from '../admin';

@Entity()
export class journalism extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => AdminUser)
  author: AdminUser;

  @Column()
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'bool', default: false })
  isApprove: boolean;

  @Column({ nullable: true })
  reasonsForRefusal: string;
}