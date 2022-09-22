import { PickType } from "@nestjs/swagger";
import { RolesDto } from "./allRoles.dto";

export class GetRolesDto extends PickType(RolesDto, [
  'id',
  'roleName',
  'roleDescription'
]) {}