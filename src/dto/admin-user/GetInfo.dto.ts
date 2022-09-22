import { PickType, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

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
  roles: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: '用户类型' })
  type: boolean;
}