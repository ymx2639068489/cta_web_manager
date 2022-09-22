import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { RolesDto } from '../roles/allRoles.dto';

export class AllAdminUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'id', default: '6f35c16a-3e7f-4f61-aaa3-8443441074b3' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '管理员账号', default: 'ymx' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '管理员密码', default: '123' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '管理员头像' })
  avatarUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '管理员邮箱' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '管理员邮箱' })
  phone: string;

  @ApiProperty({ description: '管理员权限', isArray: true })
  roles: RolesDto;
}