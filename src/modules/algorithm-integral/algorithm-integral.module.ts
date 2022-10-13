import { AlgorithmIntegral } from '@/entities/algorithmIntegral';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AlgorithmIntegralController } from './algorithm-integral.controller';
import { AlgorithmIntegralService } from './algorithm-integral.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([AlgorithmIntegral])
  ],
  controllers: [AlgorithmIntegralController],
  providers: [AlgorithmIntegralService]
})
export class AlgorithmIntegralModule {}
