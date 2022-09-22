import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { AllAdminUserDto } from './all-admin-user.dto';

export class AdminUserLoginDto extends PickType(AllAdminUserDto, [
  'username',
  'password'
]) {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: '类型: true->社团成员, false->管理员', default: false })
  type: boolean;
}
