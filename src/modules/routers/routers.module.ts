import { Module } from '@nestjs/common';
import { RoutersService } from './routers.service';
import { RoutersController } from './routers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Router } from '@/entities/routers';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Router])
  ],
  providers: [RoutersService],
  controllers: [RoutersController]
})
export class RoutersModule {}
