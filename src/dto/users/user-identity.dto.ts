import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserIdentityDto {
  // 部门
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '部门', example: '技术服务部' })
  department: string;
  // 职责
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '职责', example: '干事' })
  duty: string;
}
