import { Module } from '@nestjs/common';
import { NewbornAlgoirthmService } from './newborn-algoirthm.service';
import { NewbornAlgoirthmController } from './newborn-algoirthm.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { newbornAlgoirthmCompetition } from '@/entities/newbornAlgorithmCompetition';
import { ActiveTimeModule } from '../active-time/active-time.module';

@Module({
  imports: [
    UserModule,
    ActiveTimeModule,
    TypeOrmModule.forFeature([newbornAlgoirthmCompetition])
  ],
  providers: [NewbornAlgoirthmService],
  controllers: [NewbornAlgoirthmController]
})
export class NewbornAlgoirthmModule {}
