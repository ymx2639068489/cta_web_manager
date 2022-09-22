import { PickType } from '@nestjs/swagger';
import { AllAdminUserDto } from './all-admin-user.dto';

export class SetAdminPasswordDto extends PickType(AllAdminUserDto, [
  'id',
  'password'
]) {}
