import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActiveTimeDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '活动名称' })
  activeName: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: '结束时间' })
  endTime: Date;
}