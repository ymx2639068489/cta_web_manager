import { ApiProperty, PickType} from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RolesDto } from './allRoles.dto';

export class UpdateRoleRouterDto extends PickType(RolesDto, [
  'id',
]) {
  @IsNotEmpty()
  @ApiProperty({ description: '路由数组(字符串)' })
  routers: any;
}
export class UpdateRoleInfoDto extends PickType(RolesDto, [
  'roleName',
  'roleDescription',
  'id',
]) {}
