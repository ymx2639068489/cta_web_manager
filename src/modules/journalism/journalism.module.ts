import { Module } from '@nestjs/common';
import { JournalismService } from './journalism.service';
import { JournalismController } from './journalism.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { journalism } from '@/entities/journalism';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([journalism])
  ],
  providers: [JournalismService],
  controllers: [JournalismController]
})
export class JournalismModule {}
