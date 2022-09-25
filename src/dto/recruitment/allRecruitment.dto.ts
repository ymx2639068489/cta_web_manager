import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DepartmentEnum, IdentityEnum } from '@/enum/roles';
import { UserDto } from '../users';
import { RecruitmentStatus } from '@/enum/recruitment';

export class AllRecruitmentDto {
  @ApiProperty()
  user: UserDto;

  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '存照' })
  inchPhoto: string;

  @IsEnum(DepartmentEnum)
  @IsNotEmpty()
  @ApiProperty({
    description: '第一志愿',
    example: '算法竞赛部',
  })
  firstChoice: DepartmentEnum;

  @IsEnum(DepartmentEnum)
  @IsNotEmpty()
  @ApiProperty({
    description: '第二志愿',
    example: '项目实践部',
  })
  secondChoice: DepartmentEnum;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: '是否服从调剂',
    example: true,
  })
  isAdjust: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '个人简历',
    example: '我会C、C++',
  })
  curriculumVitae: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '竞选理由',
    example: '我很喜欢搞技术',
  })
  reasonsForElection: string;
  
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: '是否已经投递',
    example: false,
  })
  isDeliver: boolean;

  @IsNotEmpty()
  @ApiProperty({ description: '最终录取部门', enum: DepartmentEnum })
  finallyDepartment: DepartmentEnum;

  
  @IsNotEmpty()
  @ApiProperty({
    description: '状态',
    enum: RecruitmentStatus,
    default: RecruitmentStatus.Accepted
  })
  status: RecruitmentStatus;
}