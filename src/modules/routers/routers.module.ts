import { Module } from '@nestjs/common';
import { RoutersController } from './routers.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [RoutersController]
})
export class RoutersModule {}
