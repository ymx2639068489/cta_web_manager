import { CompetitionAwardLevel } from "@/enum/competition";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AllPreviousWinnersDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id' })
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '第几届' })
  session: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '比赛名字' })
  competitionName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '专业' })
  major?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '班级' })
  class?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '姓名' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '学号' })
  studentId: string;

  @IsNotEmpty()
  @ApiProperty({ description: '获奖级别', enum: CompetitionAwardLevel })
  awardLevel: CompetitionAwardLevel;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '备注' })
  remarks: string;
}