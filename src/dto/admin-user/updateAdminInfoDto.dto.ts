import { PartialType, PickType } from "@nestjs/swagger";
import { AllAdminUserDto } from './all-admin-user.dto';

export class UpdateAdminSelfInfoDto extends PartialType(
  class extends PickType(AllAdminUserDto, [
    'avatarUrl',
    'email',
    'phone',
    'password',
  ]) {}
) {}
