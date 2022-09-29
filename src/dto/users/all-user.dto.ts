import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class AllUserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id' })
  id: number;
  // 姓名
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '姓名', example: '张三' })
  username: string;
  // 学号
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '+学号', example: '20101010110' })
  studentId: string;
  // 性别
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: '性别true -> 女 false -> 男', example: false })
  gender: boolean;
  // 密码
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '+密码', example: '123456' })
  password: string;
  // 学院
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '学院', example: '计算机科学与工程' })
  college: string;
  // 专业
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '专业', example: '软件工程' })
  major: string;
  // 班级
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '班级', example: '20204' })
  class: string;
  // QQ
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '+QQ', example: '18547304726' })
  qq: string;
  // 手机号
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '+手机号', example: '1521' })
  phoneNumber: string;
  // 头像地址
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '头像地址', example: 'http://www.baidu.com' })
  avatarUrl: string;
}