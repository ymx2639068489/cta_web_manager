import { Module } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentController } from './recruitment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruitment } from '@/entities/recruitment';
import { User } from '@/entities/admin';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
import { ActiveTimeModule } from '../active-time/active-time.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    ActiveTimeModule,
    TypeOrmModule.forFeature([Recruitment, User])
  ],
  providers: [RecruitmentService],
  controllers: [RecruitmentController]
})
export class RecruitmentModule {}
