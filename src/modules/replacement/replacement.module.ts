import { Module } from '@nestjs/common';
import { ReplacementService } from './replacement.service';
import { ReplacementController } from './replacement.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Replacement } from '@/entities/replacement';
import { User, UserIdentity } from '@/entities/admin';
import { ActiveTimeModule } from '../active-time/active-time.module';

@Module({
  imports: [
    UserModule,
    ActiveTimeModule,
    TypeOrmModule.forFeature([Replacement, User, UserIdentity])
  ],
  providers: [ReplacementService],
  controllers: [ReplacementController]
})
export class ReplacementModule {}
