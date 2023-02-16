import { PickType} from '@nestjs/swagger';
import { RolesDto } from './allRoles.dto';

export class CreateRoleDto extends PickType(RolesDto, [
  'roleName',
  'roleDescription',
]) {};
