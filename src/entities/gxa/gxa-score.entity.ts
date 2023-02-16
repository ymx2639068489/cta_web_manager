// import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { BaseEntity } from '../base.entity';
// import { GxaWork } from './gxa.work.entity';

// @Entity()
// export class GxaScore extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @JoinColumn()
//   @OneToOne(() => GxaWork)
//   work: GxaWork;

//   @Column({ type: 'longtext', nullable: true })
//   score: string;
// }