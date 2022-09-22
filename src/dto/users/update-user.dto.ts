import { PartialType, PickType } from '@nestjs/swagger';
import { AllUserDto } from './all-user.dto';
class updateUser extends PickType(AllUserDto, [
  'username',
  'college',
  'major',
  'class',
  'qq',
  'phoneNumber',
  'avatarUrl',
  'gender'
]) {}

export class UpdateUserDto extends PartialType(updateUser) {}

