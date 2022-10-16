import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserDto } from '../users';

export class AlgorithmIntegralDto {
  
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'id' })
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  user: UserDto;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '学期' })
  semester: string;
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '比赛名称' })
  compititionName: string;
  
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '积分' })
  integral: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '比赛名称' })
  description: string;
}