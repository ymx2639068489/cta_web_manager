import { ApiProperty, PickType} from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { CreateRouterDto } from '../routers';
import { RolesDto } from './allRoles.dto';

export class UpdateRoleDto extends PickType(RolesDto, [
  'roleName',
]) {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ isArray: true })
  routers: CreateRouterDto;
}