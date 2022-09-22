import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { UserDto } from '../users';
import { CompetitionAwardLevel } from '@/enum/competition';

export class AllNewbornAlgoirhmCompetitionDto {
  @ApiProperty({ description: 'id' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user: UserDto;

  @ApiProperty({ description: '获奖级别', enum: CompetitionAwardLevel })
  awardLevel: CompetitionAwardLevel;
}