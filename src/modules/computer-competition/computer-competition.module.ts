import {
  Question,
  TestPaper
} from '@/entities/computerKnowledgeCompetition';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ComputerCompetitionController } from './computer-competition.controller';
import { ComputerCompetitionService } from './computer-competition.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Question, TestPaper])
  ],
  controllers: [ComputerCompetitionController],
  providers: [ComputerCompetitionService]
})
export class ComputerCompetitionModule {}
