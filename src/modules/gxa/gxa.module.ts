import { Module } from '@nestjs/common';
import { GxaService } from './gxa.service';
import { GxaController } from './gxa.controller';
import { ActiveTimeModule } from '../active-time/active-time.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GxaApplicationForm } from '@/entities/gxa';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    ActiveTimeModule,
    TypeOrmModule.forFeature([GxaApplicationForm]),
  ],
  providers: [GxaService],
  controllers: [GxaController]
})
export class GxaModule {}
