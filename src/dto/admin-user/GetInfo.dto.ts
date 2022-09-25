import { PickType, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { GetRolesDto } from '../roles';
import { CreateUserIdentityDto } from '../users';

import { AllAdminUserDto } from './all-admin-user.dto';

export class GetInfo extends PickType(AllAdminUserDto, [
  'id',
  'username',
  'phone',
  'avatarUrl',
  'email',
]) {
  @IsNotEmpty()
  @ApiProperty({ description: '角色' })
  roles: GetRolesDto;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: '用户类型' })
  type: boolean;
  @IsNotEmpty()
  @ApiProperty({ description: '社团成员登录时才会有的字段' })
  identity: CreateUserIdentityDto;
}