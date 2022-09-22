import { ApiProperty, PickType} from '@nestjs/swagger';
import { CreateRouterDto } from '../routers';
import { RolesDto } from './allRoles.dto';

export class CreateRoleDto extends PickType(RolesDto, [
  'roleName',
]) {
  @ApiProperty()
  routers: CreateRouterDto
}