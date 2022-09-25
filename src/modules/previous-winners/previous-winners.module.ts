import { PreviousWinners } from '@/entities/previousWinners';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PreviousWinnersController } from './previous-winners.controller';
import { PreviousWinnersService } from './previous-winners.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([PreviousWinners])
  ],
  controllers: [PreviousWinnersController],
  providers: [PreviousWinnersService]
})
export class PreviousWinnersModule {}
