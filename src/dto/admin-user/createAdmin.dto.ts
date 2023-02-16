import { AdminRole } from "@/enum/roles";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { AllAdminUserDto } from "./all-admin-user.dto";
/**
 * 创建一个管理员时，只需要指定其角色即可，而如果需要新建角色
 * 则需要在创建管理员之前创建角色，再把该角色给管理员
 */
export class CreateAdminDto extends PickType(AllAdminUserDto, [
  'username',
  'password',
  'phone',
]) {
  @IsNotEmpty()
  @ApiProperty({ description: '角色id' })
  roles: AdminRole;
}
